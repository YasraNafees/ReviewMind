import UploadBox from './UploadBox';
import KpiCards from './KpiCards';
import SentimentBar from './SentimentBar';
import ComplaintGroups from './ComplaintsGroups';
import AiInsights from './AiInsights';
import ChatBot from './ChatBot'; 
import styles from "../styles/App.module.css";

export default function OverviewPage(d) {
  return (
    <>
      <UploadBox selectedFile={d.selectedFile} uploadMsg={d.uploadMsg} uploadStatus={d.uploadStatus} onSelectFile={d.setSelectedFile} onUpload={d.handleUpload} />
      <KpiCards totalReviews={d.totalReviews} sentimentScore={d.sentimentScore} negPct={d.negPct} loading={d.loading} />
      
      <div className={styles.grid2}>
        <SentimentBar totalReviews={d.totalReviews} negPct={d.negPct} neuPct={d.neuPct} posPct={d.posPct} loading={d.loading} />
        <ComplaintGroups clusters={d.clusters} maxComplaints={d.maxComplaints} loading={d.loading} />
      </div>
      
      <div className={styles.grid2Bottom}>
        <AiInsights summary={d.summary} summaryLoading={d.summaryLoading} onGenerate={d.getSummary} />
        <ChatBot question={d.question} botAnswer={d.botAnswer} botLoading={d.botLoading} onQuestionChange={d.setQuestion} onSend={d.askBot} />
      </div>
    </>
  );
}