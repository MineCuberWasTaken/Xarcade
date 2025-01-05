// ==UserScript==
// @name         Xarcade Helper
// @namespace    https://github.com/ChekinNooget/Xarcade
// @version      1.1
// @description  Various QoL features for Xarcade
// @author       Chekin Nooget
// @match        https://artofproblemsolving.com/community/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  if (localStorage.getItem("xarcadeGradients") != null) {
    var newGradients = localStorage.getItem("xarcadeGradients").split(" ")
    newGradients.pop()
  } else {
    localStorage.setItem("xarcadeGradients", "#B0600D|#E6B925 #0000ff|#00ffff #ff0000|#ffb833 #3da103|#5beb09 ")
  }
  
  if (localStorage.getItem("xarcadeToggles") != null) {

  } else {
    localStorage.setItem("xarcadeToggles", "11")
  }


  let url = "https://github.com/MineCuberWasTaken/Xarcade/blob/main/main.json";
  var xarcade;
  fetch("https://github.com/MineCuberWasTaken/Xarcade/blob/main/main.json")
    .then((jsonData) => jsonData.json())
    .then((data) => printIt(data));

  let printIt = (data) => {
    const style = document.createElement("style");
    
    style.textContent = `.cmty-post-username a{
      display: flex;
      flex-direction: column;
  }\n
  .cmty-user-admin.cmty-post-username a {
  display: contents;
  }\n
  .cmty-posting-submenu-font-color{
      height: min-content !important;
    }\n
  .cmty-mark-all-read{
      display: revert !important;
    }`;
    if (localStorage.getItem("xarcadeToggles")[1] == "1") {
      style.textContent = style.textContent + `
      .cmty-post-left a img{
          width: 86px;
          height: 86px;
          border: transparent 3px solid;
          border-radius: 5px;
      }\n`
    }
    xarcade = data;
    for (let i = 0; i < Object.keys(xarcade.usernames).length; i++) {
      //flairs
      if (localStorage.getItem("xarcadeToggles")[0] == "1") {
        if (xarcade.usernames[Object.keys(xarcade.usernames)[i]].flair) {
          style.textContent =
            style.textContent +
            `.cmty-post-username a[href="/community/user/${xarcade.usernames[Object.keys(xarcade.usernames)[i]].id
            }"]::after{
    content: "${xarcade.usernames[Object.keys(xarcade.usernames)[i]].flair}";
    color: gray;
    font-style: italic
}\n\n`;
        }
      }

      //borders
      if (localStorage.getItem("xarcadeToggles")[1] == "1") {
        if (xarcade.usernames[Object.keys(xarcade.usernames)[i]].border) {
          style.textContent =
            style.textContent +
            `.cmty-post-left a[href="/community/user/${xarcade.usernames[Object.keys(xarcade.usernames)[i]].id
            }"] img{
    border-color: ${xarcade.usernames[Object.keys(xarcade.usernames)[i]].border
            };
}\n\n`;
        }
      }
    }
    document.head.appendChild(style);
  };

  window.onload = function () {
    AoPS.Community.Lang["cat-cell-mark-read"] = "Xarcade Helper Settings"
    AoPS.Community.Lang["cat-cell-mark-read-title"] = "Change settings in the Xarcade Helper userscript"
    AoPS.Community.Views.CategoryCell.prototype.onClickMarkAllRead = function(){
      return function () {
        var xarcadeSettingsDiv = document.createElement("div")
        xarcadeSettingsDiv.textContent = ``
        
        //gradients

        var mainColor = ["#a90008"]
        var secondColor = ["#ffe4e1"]
        if (localStorage.getItem("xarcadeGradients") != null) {
          var temp = localStorage.getItem("xarcadeGradients").trim().split(" ")
          for (let i = 0; i < temp.length; i++) {
            mainColor[i] = temp[i].split("|")[0]
            secondColor[i] = temp[i].split("|")[1]
          }
        }
        const pickerDiv = `<div class='picker-group'>
            <input type='color' class='main-color'>
            <input type='color' class='second-color'>
            </div>`
        const sideButtons = `<button class='delete-color'>-</button>
        <button class='add-color'>+</button>
        <button class='save-color'>Save</button>`
        var tempToggleArr = []
        for (let i = 0; i < localStorage.getItem("xarcadeToggles").length; i++) {
          if (localStorage.getItem("xarcadeToggles")[i] == "1") {
            tempToggleArr[i] = " checked"
          } else {
            tempToggleArr[i] = ""
          }
        }
        console.log(tempToggleArr)
        xarcadeSettingsDiv.innerHTML =
          `Refresh the page to see changes.<br><br>
          <div class='xarcade-checkboxes'><input type='checkbox' class='flair-checkbox xarcade-checkbox'${tempToggleArr[0]}> Enable flairs<br>
          <input type='checkbox' class='border-checkbox xarcade-checkbox'${tempToggleArr[1]}> Enable borders</div><br>
          Add gradients here. For each row, the first color is the first color in the gradient.`
        
        for (let i = 0; i < mainColor.length; i++) {
          var tempDiv = document.createElement("div")
          tempDiv.innerHTML = pickerDiv
          tempDiv.querySelector(".main-color").setAttribute("value", mainColor[i])
          tempDiv.querySelector(".second-color").setAttribute("value", secondColor[i])
          xarcadeSettingsDiv.innerHTML = xarcadeSettingsDiv.innerHTML + tempDiv.innerHTML
        }
        xarcadeSettingsDiv.innerHTML = xarcadeSettingsDiv.innerHTML + sideButtons
        xarcadeSettingsDiv.querySelector(".delete-color").onclick = deleteColor
        xarcadeSettingsDiv.querySelector(".add-color").onclick = addColor
        xarcadeSettingsDiv.querySelector(".save-color").onclick = setColorToStorage
        alert(xarcadeSettingsDiv)
        
        function deleteColor() {
          var tempDiv = xarcadeSettingsDiv.querySelectorAll(".picker-group")
          tempDiv[tempDiv.length - 1].remove()
          mainColor.pop()
          secondColor.pop()
        }
        function addColor() {
          var tempDiv = document.createElement("div")
          tempDiv.insertAdjacentHTML("beforeend", pickerDiv)
          xarcadeSettingsDiv.insertBefore(
            tempDiv,
            xarcadeSettingsDiv.childNodes[xarcadeSettingsDiv.childNodes.length - 5]
          )
        }
        function setColorToStorage() {
          var tempElement = xarcadeSettingsDiv.querySelectorAll(".picker-group")
          for (let i = 0; i < tempElement.length; i++) {
            mainColor[i] = tempElement[i].querySelector(".main-color").value
            secondColor[i] = tempElement[i].querySelector(".second-color").value
          }
          var temp = ""
          for (let i = 0; i < mainColor.length; i++) {
            temp = temp + mainColor[i] + "|" + secondColor[i] + " "
          }
          localStorage.setItem("xarcadeGradients", temp)
        }
        //other settings
        alert(xarcadeSettingsDiv)
        var tempToggles = document.querySelector(".xarcade-checkboxes").querySelectorAll(".xarcade-checkbox")
        for (let i = 0; i < tempToggles.length; i++) {
          tempToggles[i].addEventListener('change', (event) => {
            var tempTogglesStr = ""
            for (let i = 0; i < tempToggles.length; i++) {
              if (tempToggles[i].checked) {
                tempTogglesStr = tempTogglesStr + "1"
              } else {
                tempTogglesStr = tempTogglesStr + "0"
              }
            }
            console.log(tempTogglesStr)
            localStorage.setItem("xarcadeToggles", tempTogglesStr)
        })
        }
      }
    }()
    for (let i = 0; i < newGradients.length; i++) {
      AoPS.Community.Constants.bbCode.font_colors.push(newGradients[i]);
    }
    AoPS.Community.Views.PostingEnviron.prototype.applyBbCode = (function () {
      return function (button) {
        var wrap_start, scroll_loc, wrap_end, shouldIndividual;

        scroll_loc = this.$post_box.scrollTop();
        wrap_start = "[" + button.stub;

        // See if there's a second thing to process here,
        //  like who is being quoted or a color code.
        if (button.hasOwnProperty("secondary")) {
          wrap_start += "=" + button.secondary;
        }

        wrap_start += "]";
        wrap_end = "[/" + button.stub + "]";

        //this next line is most important.
        if (button.secondary) {
          if (typeof button.secondary == "string") {
            if (button.secondary.includes("|")) {
              shouldIndividual = button.secondary;
            } else {
              shouldIndividual = false;
            }
          }
        } else {
          shouldIndividual = false;
        }

        for (let i = 0; i < 1; i++) {
          this.wrapTextareaSelection(wrap_start, wrap_end, shouldIndividual);
        }
        this.$post_box.scrollTop(scroll_loc);
      };
    })();
    AoPS.Community.Views.PostingEnviron.prototype.wrapTextareaSelection =
      (function () {
        return function (wrap_start, wrap_end, shouldIndividual) {
          var val = this.$post_box.val(),
            sel_start = this.$post_box[0].selectionStart,
            sel_end = this.$post_box[0].selectionEnd,
            new_string;
          var temp = "";
          if (shouldIndividual && sel_start != sel_end) {
            var colorsArr = generateColor(
              shouldIndividual.split("|")[0],
              shouldIndividual.split("|")[1],
              sel_end - sel_start
            );
            for (let i = 0; i < sel_end - sel_start; i++) {
              temp =
                temp +
                `[color=${colorsArr[i]}]` +
                val.slice(sel_start + i, sel_start + i + 1) +
                wrap_end;
            }
            new_string = val.slice(0, sel_start) + temp + val.slice(sel_end);
          } else {
            new_string =
              val.slice(0, sel_start) +
              wrap_start +
              val.slice(sel_start, sel_end) +
              wrap_end +
              val.slice(sel_end);
          }
          this.$post_box.val(new_string);
          this.$post_box.focus();
          if (!shouldIndividual) {
            this.$post_box[0].setSelectionRange(
              sel_start + wrap_start.length,
              sel_end + wrap_start.length
            );
          } else {
            this.$post_box[0].setSelectionRange(sel_start, sel_start + 24 * colorsArr.length);
          }
          console.log(sel_start, sel_end);
        };
      })();
    function hex(c) {
      var s = "0123456789abcdef";
      var i = parseInt(c);
      if (i == 0 || isNaN(c)) return "00";
      i = Math.round(Math.min(Math.max(0, i), 255));
      return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
    }
    /* Convert an RGB triplet to a hex string */
    function convertToHex(rgb) {
      return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
    }
    /* Remove '#' in color hex string */
    function trim(s) {
      return s.charAt(0) == "#" ? s.substring(1, 7) : s;
    }
    /* Convert a hex string to an RGB triplet */
    function convertToRGB(hex) {
      var color = [];
      color[0] = parseInt(trim(hex).substring(0, 2), 16);
      color[1] = parseInt(trim(hex).substring(2, 4), 16);
      color[2] = parseInt(trim(hex).substring(4, 6), 16);
      return color;
    }
    function generateColor(colorStart, colorEnd, colorCount) {
      // The beginning of your gradient
      var start = convertToRGB(colorStart);
      // The end of your gradient
      var end = convertToRGB(colorEnd);
      // The number of colors to compute
      var len = colorCount;
      //Alpha blending amount
      var alpha = 0.0;
      var saida = [];
      for (let i = 0; i < len; i++) {
        var c = [];
        alpha += 1.0 / len;

        c[0] = start[0] * alpha + (1 - alpha) * end[0];
        c[1] = start[1] * alpha + (1 - alpha) * end[1];
        c[2] = start[2] * alpha + (1 - alpha) * end[2];

        saida.push("#" + convertToHex(c));
      }
      saida = saida.reverse();
      return saida;
    }
  };
})();
