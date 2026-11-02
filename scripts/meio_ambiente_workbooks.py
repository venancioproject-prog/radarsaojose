"""Leitura de .xls SpreadsheetML oficial, preservando índices e tipos."""
import xml.etree.ElementTree as ET
def spreadsheetml(data):
 ns={'s':'urn:schemas-microsoft-com:office:spreadsheet'};prefix='{'+ns['s']+'}';out=[]
 for sheet in ET.fromstring(data).findall('s:Worksheet',ns):
  rows=[]
  for row in sheet.findall('s:Table/s:Row',ns):
   index=int(row.get(prefix+'Index',len(rows)+1));rows.extend([] for _ in range(index-1-len(rows)));values=[]
   for cell in row.findall('s:Cell',ns):
    column=int(cell.get(prefix+'Index',len(values)+1));values.extend(None for _ in range(column-1-len(values)));node=cell.find('s:Data',ns);v=node.text if node is not None else None
    if node is not None and node.get(prefix+'Type')=='Number' and v is not None:v=float(v)
    values.append(v)
   rows.append(values)
  out.append((sheet.get(prefix+'Name'),rows))
 return out
