import sys
import odoorpc
from datetime import datetime
db = sys.argv[1]
pwd = sys.argv[2]
timeout = int(sys.argv[3])
odoo = odoorpc.ODOO("payroll.truenorthafrica.com")
timeout_backup = odoo.config['timeout']
odoo.config['timeout'] = timeout
dump = odoo.db.dump(pwd, db)
odoo.config['timeout'] = timeout_backup
backup_file = "/home/devops/Projects/slavem/images/odoo-builder/backups/%s-%s.zip" % (db,
                                          datetime.now().strftime('%Y-%m-%d-%H-%M-%S'))
with open(backup_file, 'wb') as dump_zip:
    dump_zip.write(dump.read())
