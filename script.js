document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const searchButton = document.getElementById("search-btn")
    const usernameInput = document.getElementById("user-input")
    const resultsWrapper = document.getElementById("results-wrapper")
    const errorMessage = document.getElementById("error-message")
    const easyProgressCircle = document.querySelector(".easy-progress")
    const mediumProgressCircle = document.querySelector(".medium-progress")
    const hardProgressCircle = document.querySelector(".hard-progress")
    const easyLabel = document.getElementById("easy-label")
    const mediumLabel = document.getElementById("medium-label")
    const hardLabel = document.getElementById("hard-label")
    const statsCardContainer = document.querySelector(".stats-card-container")
    const buttonText = document.querySelector(".btn-text")
    const loader = document.querySelector(".loader")
  
    // Event Listeners
    searchButton.addEventListener("click", handleSearch)
    usernameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    })
  
    // Functions
    function handleSearch() {
      const username = usernameInput.value
      if (validateUsername(username)) {
        fetchUserDetails(username)
      }
    }
  
    function validateUsername(username) {
      if (username.trim() === "") {
        showError("Username should not be empty")
        return false
      }
      return true
    }
  
    function showError(message) {
      errorMessage.querySelector("p").textContent = message
      errorMessage.classList.remove("hidden")
      resultsWrapper.classList.add("hidden")
      setTimeout(() => {
        errorMessage.classList.add("hidden")
      }, 5000)
    }
  
    async function fetchUserDetails(username) {
      const url = `https://leetcode-stats-api.herokuapp.com/${username}`
  
      try {
        // Show loading state
        setLoadingState(true)
  
        const response = await fetch(url)
  
        if (!response.ok) {
          throw new Error("Unable to fetch user details")
        }
  
        const data = await response.json()
  
        if (data.status === "error") {
          throw new Error(data.message || "User not found")
        }
  
        // Hide error message if it was shown
        errorMessage.classList.add("hidden")
  
        // Display the data
        displayUserData(data)
  
        // Show results
        resultsWrapper.classList.remove("hidden")
      } catch (error) {
        console.error("Error:", error)
        showError("User not found or API error. Please check the username and try again.")
      } finally {
        // Hide loading state
        setLoadingState(false)
      }
    }
  
    function setLoadingState(isLoading) {
      if (isLoading) {
        buttonText.style.display = "none"
        loader.style.display = "block"
        searchButton.disabled = true
      } else {
        buttonText.style.display = "block"
        loader.style.display = "none"
        searchButton.disabled = false
      }
    }
  
    function updateProgress(solved, total, label, circle, color) {
      const progressPercentage = (solved / total) * 100
  
      // Update the label
      label.textContent = `${solved}/${total}`
  
      // Animate the progress
      setTimeout(() => {
        circle.style.setProperty("--progress", `${progressPercentage}%`)
      }, 100)
    }
  
    function displayUserData(data) {
      // Extract data
      const totalQues = data.totalQuestions
      const totalEasyQues = data.totalEasy
      const totalMediumQues = data.totalMedium
      const totalHardQues = data.totalHard
  
      const solvedTotalQues = data.totalSolved
      const solvedEasyQues = data.easySolved
      const solvedMediumQues = data.mediumSolved
      const solvedHardQues = data.hardSolved
  
      const rateOfAccept = data.acceptanceRate
      const ranking = data.ranking
      const contribution = data.contributionPoints
  
      // Update progress circles
      updateProgress(solvedEasyQues, totalEasyQues, easyLabel, easyProgressCircle, "--easy")
      updateProgress(solvedMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle, "--medium")
      updateProgress(solvedHardQues, totalHardQues, hardLabel, hardProgressCircle, "--hard")
  
      // Prepare card data
      const cardsData = [
        {
          label: "Total Solved",
          value: solvedTotalQues,
        },
        {
          label: "Acceptance Rate",
          value: `${rateOfAccept}%`,
        },
        {
          label: "Ranking",
          value: ranking.toLocaleString(),
        },
        {
          label: "Contribution",
          value: contribution,
        },
      ]
  
      // Clear previous cards
      statsCardContainer.innerHTML = ""
  
      // Create and append cards with staggered animation
      cardsData.forEach((card, index) => {
        const cardElement = document.createElement("div")
        cardElement.className = "card"
        cardElement.style.animationDelay = `${index * 0.1}s`
  
        cardElement.innerHTML = `
                  <h4>${card.label}</h4>
                  <p>${card.value}</p>
              `
  
        statsCardContainer.appendChild(cardElement)
      })
    }
  })
  