import styles from '../styles/InsightsPage.module.css';
import EmptyState from './EmptyState';


export default function InsightsPage({
  summary,
  summaryLoading,
  onGenerate
}) {


  return (

    <div className={styles.card}>


      <div className={styles.header}>

        <div>

          <p className={styles.title}>
            Full analysis
          </p>

          <p className={styles.subtitle}>
            Detailed AI breakdown of review themes, patterns, and recommendations
          </p>

        </div>



        <button
          className={styles.genBtn}
          onClick={onGenerate}
          disabled={summaryLoading}
        >

          {
            summaryLoading
            ? "Analyzing..."
            : "Run analysis"
          }

        </button>


      </div>




      {
        summary &&
        typeof summary === "object" &&
        Object.keys(summary).length > 0

        ?

        <div className={`${styles.content} ${styles.hasContent}`}>

        {
          Object.entries(summary).map(
            ([cluster,text]) => (

              <div
                key={cluster}
                className={styles.cluster}
              >


                <h3>
                  {
                    cluster.replace(
                      "Cluster_",
                      "Group "
                    )
                  }
                </h3>


                <pre className={styles.summaryText}>
                  {text}
                </pre>


              </div>

            )
          )
        }


        </div>


        :


        <EmptyState

          icon="insights"

          title="No insights generated"

          description="Run analysis to discover review patterns and recommendations."

          action="Run analysis"

          onAction={onGenerate}

        />

      }


    </div>

  );

}