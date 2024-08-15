import sys
import odoorpc
from datetime import datetime
odoo = odoorpc.ODOO('odoo-web',port=8069)
db = sys.argv[1]
pwd = sys.argv[2]
timeout = int(sys.argv[3])
backup_file = "/opt/backups/%s.zip" % db
dump = open(backup_file, 'rb')
timeout_backup = odoo.config['timeout']
odoo.config['timeout'] = timeout
odoo.db.restore(pwd, db, dump, copy=True)
odoo.config['timeout'] = timeout_backup
