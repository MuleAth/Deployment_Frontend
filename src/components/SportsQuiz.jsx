import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, HelpCircle, Award } from "lucide-react";

const quizQuestions = [
  {
    id: 1,
    question: "Which sport is known as 'The Beautiful Game'?",
    options: ["Cricket", "Football", "Basketball", "Tennis"],
    correctAnswer: "Football",
  },
  {
    id: 2,
    question: "How many players are there in a standard cricket team?",
    options: ["9", "10", "11", "12"],
    correctAnswer: "11",
  },
  {
    id: 3,
    question: "Which swimming stroke is typically the fastest?",
    options: ["Butterfly", "Freestyle", "Backstroke", "Breaststroke"],
    correctAnswer: "Freestyle",
  },
  {
    id: 4,
    question: "In which sport would you perform a slam dunk?",
    options: ["Volleyball", "Basketball", "Tennis", "Football"],
    correctAnswer: "Basketball",
  },
  {
    id: 5,
    question: "How many gold medals did India win in the 2020 Tokyo Olympics?",
    options: ["0", "1", "2", "3"],
    correctAnswer: "1",
  },
];

const SportsQuiz = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return; // Prevent changing answer after selection
    
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    if (answer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowAnswer(false);
      } else {
        setQuizCompleted(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-4">Sports Quiz Challenge</h2>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Test your sports knowledge with our quick quiz!
          </p>
        </div>

        {!showQuiz ? (
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HelpCircle className="h-16 w-16 mx-auto mb-6 text-indigo-300" />
            <h3 className="text-2xl font-bold mb-4">Ready to test your sports knowledge?</h3>
            <p className="mb-8 text-indigo-200">
              This quick 5-question quiz will challenge what you know about various sports.
              See if you can score a perfect 5/5!
            </p>
            <button
              onClick={handleStartQuiz}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Quiz
            </button>
          </motion.div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
            {!quizCompleted ? (
              <div>
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span>Score: {score}/{quizQuestions.length}</span>
                  </div>
                  <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
                      style={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl md:text-2xl font-bold mb-6">
                      {quizQuestions[currentQuestion].question}
                    </h3>

                    {/* Answer options */}
                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-center ${
                            selectedAnswer === option
                              ? option === quizQuestions[currentQuestion].correctAnswer
                                ? "bg-green-500/30 border border-green-400"
                                : "bg-red-500/30 border border-red-400"
                              : "bg-white/5 hover:bg-white/10 border border-transparent"
                          } ${selectedAnswer !== null && option === quizQuestions[currentQuestion].correctAnswer
                            ? "bg-green-500/30 border border-green-400"
                            : ""
                          }`}
                        >
                          <span className="mr-3 h-6 w-6 flex-shrink-0">
                            {showAnswer && option === quizQuestions[currentQuestion].correctAnswer && (
                              <CheckCircle className="h-6 w-6 text-green-400" />
                            )}
                            {showAnswer && selectedAnswer === option && option !== quizQuestions[currentQuestion].correctAnswer && (
                              <XCircle className="h-6 w-6 text-red-400" />
                            )}
                          </span>
                          <span>{option}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Award className="h-20 w-20 mx-auto mb-6 text-yellow-400" />
                <h3 className="text-3xl font-bold mb-4">Quiz Completed!</h3>
                <p className="text-xl mb-2">Your score:</p>
                <p className="text-4xl font-bold mb-6 text-indigo-300">{score}/{quizQuestions.length}</p>
                
                {score === quizQuestions.length ? (
                  <p className="mb-8 text-green-300">Perfect score! You're a sports expert!</p>
                ) : score >= quizQuestions.length / 2 ? (
                  <p className="mb-8 text-indigo-200">Good job! You know your sports well.</p>
                ) : (
                  <p className="mb-8 text-indigo-200">Keep learning about sports and try again!</p>
                )}
                
                <button
                  onClick={resetQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SportsQuiz;