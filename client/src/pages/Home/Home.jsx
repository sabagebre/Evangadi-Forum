import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { CiShoppingTag } from "react-icons/ci";
import { IoMdPerson } from "react-icons/io";
import styles from "./home.module.css";
import axios from "../../Api/axios";
import { AppState } from "../../App";
import ScaleLoader from "react-spinners/ScaleLoader";
import Chatbot from "./Chatbot";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AppState);
  useEffect(() => {
    // local storage

    const token = localStorage.getItem("token");

    // Use axios to fetch data
    axios
      .get("/question/all-questions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Axios wraps the response in a data object
        setQuestions(response.data.questions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error.message);
        setError("Failed to connect to the server. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Filter Questions based on the user search input(Query)
  const filteredQuestions = searchQuery
    ? questions?.filter((q) => {
        const queryWords = searchQuery.toLowerCase().split(" ").filter(Boolean);
        const tags = q.tag?.toLowerCase().split(",") || [];

        // Check if any query word matches any tag
        return queryWords.some((word) =>
          tags.some((tag) => tag.trim().includes(word))
        );
      })
    : questions;
  // Calculate the subset of questions to display
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  // Handle search input changes
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Pagination functions
  const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredQuestions.length / questionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const createdDate = new Date(timestamp);
    const timeDifference = now - createdDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else {
      return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        {/* Welcome User (Top Right) */}
        <div className={styles.welcomeUser}>
          <h5>
            <>Welcome:</>
            <IoMdPerson className={styles.avatar} size={28} />
            <strong>{user.username}</strong>
          </h5>
        </div>

        {/* Ask Question Button */}
        <div className={styles.askQuestionContainer}>
          <Link to="/question" className={styles.askQuestionButton}>
            Ask Question
          </Link>

          <br />
          <input
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
            placeholder="Search questions"
            className={styles.searchInput}
          />
        </div>

        <h4 className={styles.questionsHeading}>Questions</h4>

        <div className={styles.listGroup}>
          {loading ? (
            <p className={styles.loadingText}>
              <ScaleLoader />
            </p>
          ) : currentQuestions.length > 0 ? (
            currentQuestions.map((q) => {
              return (
                <Link
                  to={`/answer/${q.question_id}`}
                  key={q.question_id}
                  className={styles.listItem}
                >
                  {/* Profile Image & Username */}
                  <div className={styles.profileSection}>
                    <IoPersonCircleOutline size={80} />
                    <div className={styles.username}>{q.user_name}</div>
                  </div>

                  {/* Question Text */}
                  <div className={styles.questionText}>
                    <p className={styles.questionTitle}>{q.title}</p>
                    <p className={styles.questionDescription}>
                      {q.description}
                    </p>
                    <div className={styles.questionMeta}>
                      <p className={styles.timeAgo}>
                        <MdOutlineDateRange size={20} />
                        {getTimeAgo(q.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className={styles.questionLasts}>
                    <div className={styles.tags}>
                      <div>
                        <CiShoppingTag
                          size={18}
                          color={"gray"}
                          className={styles.tag_icon}
                        />
                      </div>
                      <div className={styles.tags_container}>
                        {q.tag.split(",").map((t) => (
                          <span
                            style={{
                              width: "50px",
                              marginRight: "1rem",
                              outline: "0.5px solid lightgray",
                              padding: "0.1rem 0.3rem",
                              borderRadius: "0.3rem",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* More (Arrow Icon) */}
                    <IoIosArrowForward size={28} className={styles.arrowIcon} />
                  </div>
                </Link>
              );
            })
          ) : (
            <p className={styles.noQuestionsText}>
              {searchQuery
                ? "No matching questions found."
                : "No questions yet..."}
            </p>
          )}

          {/* Pagination Navigation */}
          <div className={styles.pagination}>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={styles.leftPaginationButton}
            >
              <span className={styles.previous}>Previous</span>
              <span className={styles.previousIcon}>
                <IoIosArrowBack size={33} />
              </span>
            </button>
            <button
              onClick={goToNextPage}
              disabled={
                currentPage ===
                Math.ceil(filteredQuestions.length / questionsPerPage)
              }
              className={styles.rightPaginationButton}
            >
              <span className={styles.next}>Next</span>
              <span className={styles.nextIcon}>
                <IoIosArrowForward size={33} />
              </span>
            </button>
          </div>
        </div>
        {/* Embedded AI chatbot */}
        {/* <Chatbot /> */}
      </div>
    </div>
  );
};

export default Home;
