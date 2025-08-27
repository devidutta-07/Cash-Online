// Configuration - Replace with your actual details
const WHATSAPP_NUMBER = "919876543210" // Replace with your WhatsApp number (without + sign)
const UPDATES_CHANNEL = "https://chat.whatsapp.com/your-channel-link" // Replace with your channel link

// Main WhatsApp messaging function
function sendWhatsAppMessage(type) {
  const amount =
    type === "cash" ? document.getElementById("cashAmount").value : document.getElementById("onlineAmount").value

  // Validation
  if (!amount || amount < 100) {
    showNotification("Please enter a valid amount (minimum ₹100)", "error")
    return
  }

  if (amount > 5000) {
    showNotification("Maximum amount is ₹5000 for safety reasons", "error")
    return
  }

  // Create personalized message
  const serviceType = type === "cash" ? "cash" : "online transfer"
  const actionType = type === "cash" ? "transfer online" : "have cash ready"

  const message = `🎓 GIETU Student Request

💰 Amount: ₹${amount}
📋 Service: I need ${serviceType}
✅ I can: ${actionType}

📍 Preferred meeting point: [Please specify]
⏰ Available time: [Please specify]

Are you available for this exchange?`

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  // Add loading state
  const button = event.target
  const originalText = button.innerHTML
  button.innerHTML = '<span class="btn-icon">⏳</span>Connecting...'
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

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
  showNotification("Opening WhatsApp for direct support", "info")
}

// Join updates channel
function joinUpdatesChannel() {
  if (UPDATES_CHANNEL.includes("your-channel-link")) {
    showNotification("Updates channel link not configured yet", "error")
    return
  }
  window.open(UPDATES_CHANNEL, "_blank")
  showNotification("Opening updates channel", "info")
}

// Service status toggle (for demo/admin purposes)
function toggleServiceStatus() {
  const banner = document.getElementById("statusBanner")
  const statusContent = banner.querySelector(".status-content")

  if (banner.classList.contains("paused")) {
    banner.classList.remove("paused")
    statusContent.innerHTML = `
            <span class="status-icon">✅</span>
            <span class="status-text">Service Available</span>
            <span class="status-time">24/7 Support</span>
        `
    showNotification("Service is now available!", "success")
  } else {
    banner.classList.add("paused")
    statusContent.innerHTML = `
            <span class="status-icon">❌</span>
            <span class="status-text">Service Paused</span>
            <span class="status-time">Check back later</span>
        `
    showNotification("Service is temporarily paused", "warning")
  }
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
    if (value > 5000) {
      value = 5000
      showNotification("Maximum amount is ₹5000", "warning")
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

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add click event to status banner for demo
  document.getElementById("statusBanner").addEventListener("click", toggleServiceStatus)

  // Add input formatting
  const amountInputs = document.querySelectorAll(".amount-input")
  amountInputs.forEach((input) => {
    input.addEventListener("input", () => formatAmountInput(input))
    input.addEventListener("blur", function () {
      if (this.value && Number.parseInt(this.value) < 100) {
        showNotification("Minimum amount is ₹100", "warning")
        this.focus()
      }
    })
  })

  // Add interaction effects
  addInteractionEffects()

  // Show welcome message
  setTimeout(() => {
    showNotification("Welcome to GIETU Cash Swap! 🎓", "success")
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
