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
  if (tabsName !== "close") {
    document.getElementById(tabsName).style.display = "block";
    evt.currentTarget.className += " active";
  }
}
