import sys
import odoorpc
from datetime import datetime
odoo = odoorpc.ODOO('odoo-web')
timeout_backup = odoo.config['timeout']
db = sys.argv[1]
pwd = sys.argv[2]
timeout = int(sys.argv[3])
odoo.db.drop(pwd, db)
odoo.config['timeout'] = timeout_backup
