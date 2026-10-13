const ALERT_SUCCESS_TYPE = "SUCCESS";
const ALERT_WARNING_TYPE = "WARNING";
const ALERT_ERROR_TYPE = "ERROR";

function showNotification(notificationContainerId, message, type) {
  //create the section element
  //display the message
  //after 5 secs hide it
  let notificationElement = document.createElement("section");
  let containerElement = document.getElementById(notificationContainerId)

  notificationElement.innerText = message;
  notificationElement.classList.add("notification");
  notificationElement.classList.add(getAlertTypeClass(type));

  containerElement.append(notificationElement);
  setTimeout(() => {
    notificationElement.classList.add("hidden");
    notificationElement.remove()
  }, 5000);
}

function getAlertTypeClass(alertType) {
  switch (alertType) {
    case ALERT_ERROR_TYPE:
      return "error";
    case ALERT_SUCCESS_TYPE:
      return "success";
    case ALERT_WARNING_TYPE:
      return "warning";
    default:
      return "";
  }
}
