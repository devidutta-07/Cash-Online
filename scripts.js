// Configuration - Replace with your actual details
const CONFIG = {
  // WhatsApp Settings
  WHATSAPP_NUMBER: "919692356955", // Replace with your WhatsApp number (without + sign)
  UPDATES_CHANNEL: "https://chat.whatsapp.com/your-channel-link", // Replace with your channel link

  // Team Information
  DEVELOPER_NAME: "Devidutta", // Replace with your actual name
  DEVELOPER_PORTFOLIO: "https://my-portfolio-three-jet-43.vercel.app/", // Replace with your portfolio URL
  MANAGER_NAME: "Sumit", // Replace with manager's name
  MANAGER_PROFILE: "https://www.linkedin.com/in/sumit-kumar-barik-718090370/", // Replace with manager's profile URL

  // Contact Information
  EMERGENCY_CONTACT: "+91-96923-56955", // Replace with emergency contact number
  SUPPORT_EMAIL: "deviduttadev@gmail.com", // Replace with support email

  // Service Settings
  MIN_AMOUNT: 100,
  MAX_AMOUNT: 5000,
  SERVICE_FEE_RATES: {
    "100-500": 10,
    "501-1000": 15,
    "1001-2000": 20,
  },
}

const ROLL_NUMBER_REGEX = /^(\d{2,4})[a-zA-Z]{2,6}\d{1,4}$/

function validateRollNumber(rollNumber) {
  return ROLL_NUMBER_REGEX.test(rollNumber.trim())
}

function setupRollValidation(rollInputId, validationMessageId) {
  const rollInput = document.getElementById(rollInputId)
  const validationMessage = document.getElementById(validationMessageId)

  if (rollInput && validationMessage) {
    rollInput.addEventListener("input", function () {
      const rollNumber = this.value.trim()

      if (rollNumber === "") {
        this.classList.remove("valid", "invalid")
        validationMessage.textContent = ""
        validationMessage.classList.remove("success", "error")
        return
      }

      if (validateRollNumber(rollNumber)) {
        this.classList.remove("invalid")
        this.classList.add("valid")
        validationMessage.textContent = "✓ Valid roll number format"
        validationMessage.classList.remove("error")
        validationMessage.classList.add("success")
      } else {
        this.classList.remove("valid")
        this.classList.add("invalid")
        validationMessage.textContent = "✗ Invalid format. Use: 23CSE231, 12AGRI89, etc."
        validationMessage.classList.remove("success")
        validationMessage.classList.add("error")
      }
    })
  }
}

// Main WhatsApp messaging function
function sendWhatsAppMessage(type) {
  const name =
    type === "cash"
      ? document.getElementById("cashName").value.trim()
      : document.getElementById("onlineName").value.trim()
  const rollNumber =
    type === "cash"
      ? document.getElementById("cashRoll").value.trim()
      : document.getElementById("onlineRoll").value.trim()
  const amount =
    type === "cash" ? document.getElementById("cashAmount").value : document.getElementById("onlineAmount").value

  if (!name) {
    showNotification("Please enter your full name", "error")
    return
  }

  if (!rollNumber) {
    showNotification("Please enter your roll number", "error")
    return
  }

  if (!validateRollNumber(rollNumber)) {
    showNotification("Please enter a valid roll number (e.g., 23CSE231, 12AGRI89)", "error")
    return
  }

  if (!amount || amount < CONFIG.MIN_AMOUNT) {
    showNotification(`Please enter a valid amount (minimum ₹${CONFIG.MIN_AMOUNT})`, "error")
    return
  }

  if (amount > CONFIG.MAX_AMOUNT) {
    showNotification(`Maximum amount is ₹${CONFIG.MAX_AMOUNT} for safety reasons`, "error")
    return
  }

  // Calculate service fee
  let serviceFee = 10
  if (amount > 500 && amount <= 1000) serviceFee = 15
  if (amount > 1000) serviceFee = 20

  const serviceType = type === "cash" ? "cash" : "online transfer"
  const actionType = type === "cash" ? "transfer online" : "have cash ready"

  const message = `🎓 OFFICIAL GIETU CASH SWAP REQUEST

👤 Student Details:
• Name: ${name}
• Roll No: ${rollNumber}
• Branch: [Auto-detected from roll]
• Year: [Auto-detected from roll]

💰 Transaction Details:
• Amount: ₹${amount}
• Service: I need ${serviceType}
• I can: ${actionType}
• Service Fee: ₹${serviceFee}
• Total: ₹${Number.parseInt(amount) + serviceFee}

Are you available for this verified exchange?
#GIETUCashSwap #StudentService #Verified`

  const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  // Enhanced loading state
  const button = event.target
  const originalText = button.innerHTML
  button.innerHTML = '<span class="btn-icon">⏳</span>Connecting to WhatsApp...'
  button.disabled = true

  setTimeout(() => {
    button.innerHTML = originalText
    button.disabled = false
  }, 2000)

  window.open(whatsappUrl, "_blank")
  showNotification(`Opening WhatsApp for ₹${amount} ${serviceType} request`, "success")
}

// Direct WhatsApp contact
function openDirectWhatsApp() {
  const message = `Hi! 👋

I have a question about the GIETU Cash ↔ Online Swap service.

Could you please help me with:
[ ] Service availability
[ ] Fee clarification  
[ ] Meeting point details
[ ] Other: ___________

Thank you!`

  const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
  showNotification("Opening WhatsApp for direct support", "info")
}

// Join updates channel
function joinUpdatesChannel() {
  if (CONFIG.UPDATES_CHANNEL.includes("your-channel-link")) {
    showNotification("Updates channel link not configured yet", "error")
    return
  }
  window.open(CONFIG.UPDATES_CHANNEL, "_blank")
  showNotification("Opening updates channel", "info")
}

function openProfileLink(type) {
  let url, name

  if (type === "developer") {
    url = CONFIG.DEVELOPER_PORTFOLIO
    name = CONFIG.DEVELOPER_NAME
  } else if (type === "manager") {
    url = CONFIG.MANAGER_PROFILE
    name = CONFIG.MANAGER_NAME
  }

  if (url.includes("your-portfolio-website.com") || url.includes("manager-profile-link.com")) {
    showNotification(`${name}'s profile link not configured yet`, "warning")
    return
  }

  window.open(url, "_blank")
  showNotification(`Opening ${name}'s profile`, "info")
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        backdrop-filter: blur(10px);
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(400px)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 300)
  }, 4000)
}

function getNotificationIcon(type) {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  }
  return icons[type] || icons.info
}

function getNotificationColor(type) {
  const colors = {
    success: "linear-gradient(135deg, #27ae60, #2ecc71)",
    error: "linear-gradient(135deg, #e74c3c, #c0392b)",
    warning: "linear-gradient(135deg, #f39c12, #e67e22)",
    info: "linear-gradient(135deg, #3498db, #2980b9)",
  }
  return colors[type] || colors.info
}

// Input formatting and validation
function formatAmountInput(input) {
  let value = input.value.replace(/[^\d]/g, "")
  if (value) {
    value = Number.parseInt(value)
    if (value > CONFIG.MAX_AMOUNT) {
      value = CONFIG.MAX_AMOUNT
      showNotification(`Maximum amount is ₹${CONFIG.MAX_AMOUNT}`, "warning")
    }
    input.value = value
  }
}

// Enhanced interaction effects
function addInteractionEffects() {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll(".whatsapp-btn, .action-btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `

      this.style.position = "relative"
      this.style.overflow = "hidden"
      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
}

function hideConfigNotice() {
  const notice = document.getElementById("configNotice")
  if (notice) {
    notice.style.display = "none"
    localStorage.setItem("configNoticeHidden", "true")
  }
}

function checkConfiguration() {
  const isConfigured =
    !CONFIG.WHATSAPP_NUMBER.includes("919876543210") &&
    !CONFIG.UPDATES_CHANNEL.includes("your-channel-link") &&
    !CONFIG.DEVELOPER_NAME.includes("Your Name") &&
    !CONFIG.DEVELOPER_PORTFOLIO.includes("your-portfolio-website.com") &&
    !CONFIG.MANAGER_NAME.includes("Manager Name") &&
    !CONFIG.MANAGER_PROFILE.includes("manager-profile-link.com") &&
    !CONFIG.EMERGENCY_CONTACT.includes("XXXX") &&
    !CONFIG.SUPPORT_EMAIL.includes("support@gietucashswap.com")

  const notice = document.getElementById("configNotice")
  const isHidden = localStorage.getItem("configNoticeHidden")

  if (isConfigured || isHidden) {
    if (notice) notice.style.display = "none"
  }

  // Update configuration checklist
  const configList = document.getElementById("configList")
  if (configList) {
    const items = [
      { key: "WHATSAPP_NUMBER", text: "WhatsApp Number", configured: !CONFIG.WHATSAPP_NUMBER.includes("919876543210") },
      {
        key: "UPDATES_CHANNEL",
        text: "Updates Channel Link",
        configured: !CONFIG.UPDATES_CHANNEL.includes("your-channel-link"),
      },
      {
        key: "DEVELOPER_NAME",
        text: "Developer Name & Portfolio",
        configured: !CONFIG.DEVELOPER_NAME.includes("Your Name"),
      },
      {
        key: "MANAGER_NAME",
        text: "Manager Name & Profile",
        configured: !CONFIG.MANAGER_NAME.includes("Manager Name"),
      },
      {
        key: "EMERGENCY_CONTACT",
        text: "Emergency Contact Number",
        configured: !CONFIG.EMERGENCY_CONTACT.includes("XXXX"),
      },
      {
        key: "SUPPORT_EMAIL",
        text: "Support Email",
        configured: !CONFIG.SUPPORT_EMAIL.includes("support@gietucashswap.com"),
      },
    ]

    configList.innerHTML = items.map((item) => `<li>${item.configured ? "✅" : "❌"} ${item.text}</li>`).join("")
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check configuration status
  checkConfiguration()

  setupRollValidation("cashRoll", "cashRollValidation")
  setupRollValidation("onlineRoll", "onlineRollValidation")

  const developerLink = document.getElementById("developerLink")
  const managerLink = document.getElementById("managerLink")

  if (developerLink) {
    developerLink.textContent = CONFIG.DEVELOPER_NAME
    developerLink.addEventListener("click", (e) => {
      e.preventDefault()
      if (CONFIG.DEVELOPER_PORTFOLIO.includes("your-portfolio-website.com")) {
        showNotification(`${CONFIG.DEVELOPER_NAME}'s portfolio link not configured yet`, "warning")
        return
      }
      window.open(CONFIG.DEVELOPER_PORTFOLIO, "_blank")
      showNotification(`Opening ${CONFIG.DEVELOPER_NAME}'s portfolio`, "info")
    })
  }

  if (managerLink) {
    managerLink.textContent = CONFIG.MANAGER_NAME
    managerLink.addEventListener("click", (e) => {
      e.preventDefault()
      if (CONFIG.MANAGER_PROFILE.includes("manager-profile-link.com")) {
        showNotification(`${CONFIG.MANAGER_NAME}'s profile link not configured yet`, "warning")
        return
      }
      window.open(CONFIG.MANAGER_PROFILE, "_blank")
      showNotification(`Opening ${CONFIG.MANAGER_NAME}'s profile`, "info")
    })
  }

  // Add input formatting
  const amountInputs = document.querySelectorAll(".amount-input")
  amountInputs.forEach((input) => {
    input.addEventListener("input", () => formatAmountInput(input))
    input.addEventListener("blur", function () {
      if (this.value && Number.parseInt(this.value) < CONFIG.MIN_AMOUNT) {
        showNotification(`Minimum amount is ₹${CONFIG.MIN_AMOUNT}`, "warning")
        this.focus()
      }
    })
  })

  // Add interaction effects
  addInteractionEffects()

  // Enhanced welcome message
  setTimeout(() => {
    showNotification("Welcome to Official GIETUCash Swap! 🎓✨", "success")
  }, 1000)
})

// Add CSS for ripple animation
const style = document.createElement("style")
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-message {
        font-weight: 500;
    }
`
document.head.appendChild(style)
