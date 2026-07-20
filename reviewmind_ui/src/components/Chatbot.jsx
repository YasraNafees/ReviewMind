import styles from '../styles/Chatbot.module.css';

export default function ChatBot({ question, botAnswer, botLoading, onQuestionChange, onSend }) {
  return (
    <div className={styles.card}>
      <p className={styles.title}>Chat with your data</p>
      <p className={styles.subtitle}>Ask questions about your reviews in plain language</p>
      <div className={styles.inputRow}>
        <input className={styles.inputField} type="text" placeholder="Why are people complaining about delivery?" value={question} onChange={e => onQuestionChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && !botLoading && onSend()} />
        <button className={styles.sendBtn} onClick={onSend} disabled={botLoading || !question}>{botLoading ? '...' : 'Send'}</button>
      </div>
      <div className={`${styles.responseBox} ${botAnswer ? styles.hasResponse : ''}`}>
        {botAnswer || 'Ask something — try "What\'s the most common complaint?"'}
      </div>
    </div>
  );
}