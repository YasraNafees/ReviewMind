import logging 
import os 
log_dir="logs"
if not  os.path.exists(log_dir):
    os.makedirs(log_dir)
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s-%(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(f"{log_dir}/app.log"),
        logging.StreamHandler()
    ]
)


def get_logger(name):
    return logging.getLogger(name)