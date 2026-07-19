import styles from '../styles/AiInsights.module.css';


export default function AiInsights({
  summary,
  summaryLoading,
  onGenerate
}) {


  const formatSummary = () => {


    if (!summary) {

      return 'Click "Generate" to get a concise summary of what your customers are talking about.';

    }



    // Backend object response handle
    // {
    //   Cluster_0: "...",
    //   Cluster_1: "..."
    // }

    if (typeof summary === "object") {


      return Object.entries(summary)
        .map(([cluster, text]) => {


          const groupName = cluster.replace(
            "Cluster_",
            "Group "
          );


          return (
`========== ${groupName} ==========

${text}`
          );


        })
        .join("\n\n");


    }



    // String response handle

    if (typeof summary === "string") {

      return summary;

    }



    return "No summary available.";

  };




  return (

    <div className={styles.card}>


      <div className={styles.header}>


        <div>

          <p className={styles.title}>
            Manager insights
          </p>


          <p className={styles.subtitle}>
            AI-generated summary of review themes
          </p>


        </div>



        <button

          className={styles.genBtn}

          onClick={onGenerate}

          disabled={summaryLoading}

        >

          {
            summaryLoading
            ? "Generating..."
            : "Generate"
          }


        </button>


      </div>





      <div
        className={`${styles.content} ${
          summary ? styles.hasContent : ''
        }`}
      >


        <pre className={styles.summaryText}>

          {formatSummary()}

        </pre>


      </div>



    </div>

  );

}