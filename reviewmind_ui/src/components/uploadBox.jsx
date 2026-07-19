
import styles from '../styles/UploadBox.module.css';
import { UploadCloud, Check } from 'lucide-react';


export default function UploadBox({ selectedFile, uploadMsg, uploadStatus, onSelectFile, onUpload }) {
  return (
    <>
      <div className={`${styles.dropArea} ${selectedFile ? styles.hasFile : ''}`} onClick={() => document.getElementById('csvUpload').click()}>
        <input id="csvUpload" type="file" accept=".csv" hidden onChange={e => onSelectFile(e.target.files[0])} />
        <div className={styles.dropIcon}>
          {selectedFile ? <Check size={28} color="var(--accent)" /> : <UploadCloud size={28} />}
        </div>
        <p className={styles.dropTitle}>{selectedFile ? selectedFile.name : 'Drop a CSV file here or click to browse'}</p>
        <p className={styles.dropSubtitle}>{selectedFile ? 'File selected — hit Process below' : 'Supports .csv files with review text'}</p>
      </div>
      {selectedFile && (
        <div className={styles.actionRow}>
          <button className={styles.processBtn} onClick={onUpload}>Process data</button>
          {uploadMsg && <span className={uploadStatus === 'success' ? styles.msgSuccess : uploadStatus === 'error' ? styles.msgError : styles.msgDefault}>{uploadMsg}</span>}
        </div>
      )}
    </>
  );
}