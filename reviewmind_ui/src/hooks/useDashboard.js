import { useState } from "react";
import axios from "axios";
import { logError, logInfo, logDebug } from "../utils/logger";

const FILE = "useDashboard.js";
const API = "http://127.0.0.1:8000";


const api = axios.create({
  baseURL: API,
  timeout: 120000,
});


export function useDashboard() {


  const [activeNav, setActiveNav] = useState("overview");

  const [sentiments, setSentiments] = useState([]);
  const [clusters, setClusters] = useState([]);

  
  const [summary, setSummary] = useState(null);


  const [question, setQuestion] = useState("");
  const [botAnswer, setBotAnswer] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [botLoading, setBotLoading] = useState(false);



  const fetchDashboardData = async () => {

    setLoading(true);
    setFetchError("");

    try {

      logDebug(
        FILE,
        "fetch",
        "Calling dashboard API"
      );


      const res = await api.get(
        "/get-dashboard-data/"
      );


      const data = res.data;


      if(data?.sentiments){


        setSentiments([

          {
            name:"Negative",
            value:Number(data.sentiments.Negative || 0)
          },

          {
            name:"Neutral",
            value:Number(data.sentiments.Neutral || 0)
          },

          {
            name:"Positive",
            value:Number(data.sentiments.Positive || 0)
          }

        ]);


      }


      setClusters(
        Array.isArray(data?.clusters)
        ? data.clusters
        : []
      );


    }
    catch(err){

      logError(
        FILE,
        "fetch",
        "Dashboard failed",
        err
      );


      setFetchError(
        "Unable to connect with backend."
      );


    }
    finally{

      setLoading(false);

    }

  };





  const handleUpload = async()=>{


    if(!selectedFile)
      return;



    setUploadMsg("Uploading...");
    setUploadStatus("");



    const formData = new FormData();

    formData.append(
      "file",
      selectedFile
    );


    try{


      const res = await api.post(
        "/upload-csv/",
        formData
      );


      setUploadMsg(
        res.data?.message ||
        "Upload completed successfully."
      );


      setUploadStatus("success");



    }
    catch(err){


      logError(
        FILE,
        "upload",
        "Upload failed",
        err
      );


      setUploadMsg(
        "Upload failed."
      );


      setUploadStatus(
        "error"
      );


    }

  };







  const getSummary = async () => {

  setSummaryLoading(true);
  setSummary(null);

  try {

    logInfo(
      FILE,
      "summary",
      "Generating AI summary"
    );


    const res = await api.post(
      "/generate-summary/"
    );


    console.log(
      "SUMMARY RESPONSE:",
      res.data
    );


    const data = res.data?.summary;


    if (
      data &&
      typeof data === "object" &&
      Object.keys(data).length > 0
    ) {

      setSummary(data);

    } 
    else {

      setSummary({
        "System Message":
          "No summary received from backend."
      });

    }


  } catch(err) {


    logError(
      FILE,
      "summary",
      "Summary generation failed",
      err
    );


    setSummary({

      "System Message":
        "Unable to generate insights."

    });


  } finally {

    setSummaryLoading(false);

  }

};


  const askBot = async()=>{


    if(!question.trim())
      return;



    setBotLoading(true);


    setBotAnswer(
      "Analyzing reviews..."
    );



    try{


      const res = await api.post(

        `/ask-bot/?question=${encodeURIComponent(question)}`

      );


      setBotAnswer(

        res.data?.answer ||
        "No answer generated."

      );



    }
    catch(err){


      logError(
        FILE,
        "bot",
        "Bot failed",
        err
      );


      setBotAnswer(
        "Unable to get AI response."
      );


    }
    finally{

      setBotLoading(false);

    }

  };






  const totalReviews =
    sentiments.reduce(
      (a,c)=>a+c.value,
      0
    );



  const negCount =
    sentiments.find(
      s=>s.name==="Negative"
    )?.value || 0;



  const posCount =
    sentiments.find(
      s=>s.name==="Positive"
    )?.value || 0;



  const posPct =
    totalReviews
    ? Math.round(
        (posCount / totalReviews) * 100
      )
    :0;



  const negPct =
    totalReviews
    ? Math.round(
        (negCount / totalReviews) * 100
      )
    :0;



  const neuPct =
    totalReviews
    ? 100 - posPct - negPct
    :0;



  const sentimentScore =
    totalReviews
    ? Math.round(
        ((posCount-negCount)
        /totalReviews)*50+50
      )
    :0;



  const maxComplaints =
    clusters.length
    ? Math.max(
        ...clusters.map(
          c=>Number(c.complaints || 0)
        )
      )
    :0;




  return {


    activeNav,


    sentiments,
    clusters,


    summary,


    question,
    botAnswer,


    selectedFile,


    uploadMsg,
    uploadStatus,


    loading,
    fetchError,


    summaryLoading,
    botLoading,



    setActiveNav,
    setQuestion,
    setSelectedFile,


    fetchDashboardData,
    handleUpload,


    getSummary,
    askBot,



    totalReviews,


    posPct,
    negPct,
    neuPct,


    sentimentScore,


    maxComplaints

  };


}