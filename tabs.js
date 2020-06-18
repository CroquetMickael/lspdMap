function openTabs(evt, tabsName) {
  let tabcontent, tablinks;
  tab = document.getElementsByClassName("tab");
  if (tabsName == "close") {
    tablinks = document.getElementsByClassName("tablinks");
    for (let tablink of tablinks) {
      tablink.className = tablink.className.replace(" active", "");
    }
  }
  tabcontent = document.getElementsByClassName("tabContent");
  for (let tab of tabcontent) {
    tab.style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (let tablink of tablinks) {
    tablink.className = tablink.className.replace(" active", "");
  }
  if (tabsName !== "close" && tabsName !== "deux") {
    document.getElementById(tabsName).style.display = "block";
    document.getElementById(tabsName).style.width = "";
    document.getElementById(tabsName).style.left= "";
    evt.currentTarget.className += " active";
  }
  if(tabsName == "deux"){
    let dashboard = document.getElementById("dashboard")
    dashboard.style.display = "block";
    let chat = document.getElementById("chat")
    chat.style.display = "block";
    evt.currentTarget.className += " active";
  }
}
