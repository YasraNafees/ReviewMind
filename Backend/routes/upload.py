from fastapi import APIRouter, UploadFile, File, Depends
import pandas as pd
from sqlalchemy.exc import SQLAlchemyError 
from database import get_db
from models import Review
from config import setting
from logger import get_logger
logger=get_logger(__name__)

router = APIRouter()

@router.post("/upload-csv/")
def upload_csv(file: UploadFile = File(...), db=Depends(get_db)):
    try:
        csv_reader = pd.read_csv(file.file, chunksize=setting.Chunk_size, on_bad_lines='skip', encoding='utf-8-sig')
        total_saved = 0
        
        for chunk in csv_reader:
            for index, row in chunk.iterrows():
                review_date = None
                if pd.notnull(row['Time']):
                    review_date = pd.to_datetime(row['Time'], unit='s').date()
                
                new_review = Review(
                    raw_text=str(row['Text']),
                    score=int(row['Score']) if pd.notnull(row['Score']) else None,
                    review_date=review_date
                )
                db.add(new_review)
            
            db.commit()
            total_saved += len(chunk)
            logger.info(f"Upload: Processed {total_saved} rows...")

        return {"message": f"Success! {total_saved} reviews saved."}
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Upload DB Error: {str(e)}")
        return {"error": f"Database error: {str(e)}"}
    except Exception as e:
        logger.error(f"Upload File Error: {str(e)}")
        return {"error": f"File reading error: {str(e)}"}
