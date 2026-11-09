BEGIN;

-- Updating the count of confirmed installments does not change the active
-- contract. Continue invalidating outstanding quotes on access status changes.
DO $migration$
DECLARE
  definition text := pg_get_functiondef('public.billing_process_event(text)'::regprocedure);
  old_assignment text := 'installments_paid=paid_count,version=version+1 WHERE id=s.id';
  new_assignment text := 'installments_paid=paid_count,version=version+CASE WHEN next_status IS DISTINCT FROM s.status THEN 1 ELSE 0 END WHERE id=s.id';
BEGIN
  IF strpos(definition, new_assignment) > 0 THEN RETURN; END IF;
  IF strpos(definition, old_assignment) = 0 THEN
    RAISE EXCEPTION 'Unexpected billing processor definition';
  END IF;
  EXECUTE replace(definition, old_assignment, new_assignment);
END
$migration$;

COMMIT;
