let baseURL = window.BASE_URL;
console.log(baseURL);

async function connectDB() {
  try {
    let mongoConnect = await fetch(`/connect`, {
      method: "GET",
    });

    mongoConnect = await mongoConnect.json();
    console.log(mongoConnect.pass);
    if (mongoConnect.message === "Connected") {
      console.log("mongoconnected at front");
    } else {
      console.log("MongoDB not connected, retrying connection");
      connectDB();
    }
  } catch (e) {
    console.log(e);
    console.log("MongoDB not connected, retrying connection");
    connectDB();
  }
}
async function getIds(category) {
  let response = await fetch(`/findid/${category}`, {
    method: "GET",
  });
  let data = await response.json();
  return data;
}

let heatIds, merchandiseIds, basketballIds;

async function gettingIds() {
  heatIds = await getIds("heat");
  merchandiseIds = await getIds("merchandise");
  basketballIds = await getIds("basketball");
}

async function getProduct(id) {
  let response = await fetch(`/find/product/${id}`, {
    method: "GET",
  });
  let data = await response.json();
  // console.log(data);
  return data;
}

let products_list_heat, products_list_merchandise, products_list_basketball;

async function gettingProducts() {
  await gettingIds();
  products_list_heat = await Promise.all(
    heatIds.map(async function (ele) {
      let result = await getProduct(ele.id);
      return result[0];
    })
  );
  products_list_basketball = await Promise.all(
    basketballIds.map(async function (ele) {
      let result = await getProduct(ele.id);
      return result[0];
    })
  );
  products_list_merchandise = await Promise.all(
    merchandiseIds.map(async function (ele) {
      let result = await getProduct(ele.id);
      return result[0];
    })
  );
}

async function main() {
  let user = null;
  let cart_items_array = []; // cart items array to store id of products inside the cart
  let wishlist_items_array = []; // wishlist items array to store id of products inside the wishlist
  let login_flag = 0;
  let login_but = document.querySelector(".login_button");
  let login_overlay = document.querySelector(".login");
  login_but.addEventListener("click", (e) => {
    if (login_flag) {
      login_flag = 0;
      login_but.innerHTML = "Log In";
      user = null;
      cart_items_array = [];
      wishlist_items_array = [];
      set_wishlist_buttons(wishlist_items_array);
      login_but.style.setProperty("color", "rgb(85,255,85)");
      let menu = document.querySelector(".menu_dropdown");
      menu.innerHTML = `MENU`;
    } else {
      e.stopPropagation();
      overlay_open_function(login_overlay);
    }
    dropdown_close_function();
  });

  let login_submit = document.querySelector(".login_submit");

  login_submit.addEventListener("click", () => {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;

    if (username === "" || password === "") {
      alert("Please fill in the fields");
    } else {
      async function login() {
        const response = await fetch(`/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const response_json = await response.json();
        if (response_json.message === "Login Successful") {
          login_flag = 1;
        } else if (response_json.message === "Account Created") {
          login_flag = 1;
          document.querySelector("#username").value =
            "account created succesfully";
        } else {
          login_flag = 0;
        }
        if (login_flag) {
          user = response_json.id;
          cart_items_array = response_json.cart;
          wishlist_items_array = response_json.wishlist;
          reload_cart(1);
          reload_wishlist(1);
          set_wishlist_buttons(wishlist_items_array);
          login_overlay.style.setProperty(
            "background-color",
            "rgb(85, 255, 85)"
          );
          login_submit.style.setProperty("opacity", "0");
          login_but.style.setProperty("color", "rgb(255,75,30)");
          login_but.innerHTML = "Log Out";
          let menu = document.querySelector(".menu_dropdown");
          menu.innerHTML = `Welcome <p style="color:rgb(85, 255, 85)">${username}</p> <div class="arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path></svg></div>`;
          setTimeout(() => {
            document.querySelector("#username").value = "";
            document.querySelector("#password").value = "";
            login_submit.style.setProperty("opacity", "1");
            login_overlay.style.setProperty(
              "background-color",
              "rgba(var(--overlaycolor1))"
            );
            overlay_close_function(login_overlay);
          }, 1000);
        } else {
          login_overlay.style.setProperty("background-color", "rgb(255,0,0)");
          login_submit.style.setProperty("opacity", "0");

          document.querySelector("#password").type = "text";
          document.querySelector("#password").value = "incorrect password";
          setTimeout(() => {
            document.querySelector("#password").value = "";
            login_submit.style.removeProperty("opacity");
            login_overlay.style.setProperty(
              "background-color",
              "rgba(var(--overlaycolor1))"
            );
            document.querySelector("#password").type = "password";
            document.querySelector("#password").value = "";
          }, 1000);
        }
      }
      login();
    }
  });

  let username = document.querySelector("#username");
  let password = document.querySelector("#password");
  username.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      password.focus();
    }
  });
  password.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      login_submit.click();
    }
  });

  let show_password = document.querySelector(".show_password");
  show_password.addEventListener("click", (e) => {
    e.stopPropagation();
    let password = document.querySelector("#password");
    if (password.type === "password") {
      password.type = "text";
      show_password.innerHTML = `<path
    d="M10.1305 15.8421L9.34268 18.7821L7.41083 18.2645L8.1983 15.3256C7.00919 14.8876 5.91661 14.2501 4.96116 13.4536L2.80783 15.6069L1.39362 14.1927L3.54695 12.0394C2.35581 10.6105 1.52014 8.8749 1.17578 6.96843L2.07634 6.80469C4.86882 8.81573 8.29618 10.0003 12.0002 10.0003C15.7043 10.0003 19.1316 8.81573 21.9241 6.80469L22.8247 6.96843C22.4803 8.8749 21.6446 10.6105 20.4535 12.0394L22.6068 14.1927L21.1926 15.6069L19.0393 13.4536C18.0838 14.2501 16.9912 14.8876 15.8021 15.3256L16.5896 18.2645L14.6578 18.7821L13.87 15.8421C13.2623 15.9461 12.6376 16.0003 12.0002 16.0003C11.3629 16.0003 10.7381 15.9461 10.1305 15.8421Z"
  ></path>`;
    } else {
      password.type = "password";
      show_password.innerHTML = `<path
    d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"
  ></path>`;
    }
  });

  AOS.init();
  let modeSwitch = document.querySelector(".mode_switch");
  let toggle = modeSwitch.querySelector(".toggle");
  let mode = 1; // 1 for light mode and 0 for dark mode
  var particleColor = mode === 0 ? "#000000" : "#ffffff";
  modeSwitch.addEventListener("click", () => {
    mode_change();
  });
  const mode_change = function () {
    toggle.style.left = mode * 60 + "%";
    mode = 1 - mode;

    let root = document.querySelector(":root");
    let rootStyles = getComputedStyle(root);
    let color1 = rootStyles.getPropertyValue("--color1");
    let color2 = rootStyles.getPropertyValue("--color2");
    let accent1 = rootStyles.getPropertyValue("--accent1");
    let accent2 = rootStyles.getPropertyValue("--accent2");
    let fontcolor1 = rootStyles.getPropertyValue("--fontcolor1");
    let fontcolor2 = rootStyles.getPropertyValue("--fontcolor2");
    let overlaycolor1 = rootStyles.getPropertyValue("--overlaycolor1");
    let overlaycolor2 = rootStyles.getPropertyValue("--overlaycolor2");

    root.style.setProperty("--color1", color2);
    root.style.setProperty("--color2", color1);
    root.style.setProperty("--accent1", accent2);
    root.style.setProperty("--accent2", accent1);
    root.style.setProperty("--fontcolor1", fontcolor2);
    root.style.setProperty("--fontcolor2", fontcolor1);
    root.style.setProperty("--overlaycolor1", overlaycolor2);
    root.style.setProperty("--overlaycolor2", overlaycolor1);
    featured_loader(); // function to change the images in the featured section
    let intro = document.querySelector(".intro video");
    if (mode) {
      intro.src = "/images/RTFKT x Nike Dunk Void (Trailer).mp4";
    } else {
      intro.src = `/images/nikeDunkGenesis3Dprint.mp4`;
    }

    particleColor = mode === 0 ? "#000000" : "#ffffff";

    particlesJS("particles-js", {
      particles: {
        number: {
          value: 380,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: particleColor,
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            src: "img/github.svg",
            width: 100,
            height: 100,
          },
        },
        opacity: {
          value: 1,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: false,
          distance: 150,
          color: particleColor,
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: false,
            mode: "bubble",
          },
          onclick: {
            enable: false,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 100,
            size: 5,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });
  };

  let hero_items = [
    "images/hero_light.png",
    "images/merchandise_banner.png",
    "images/adidas_campus_banner.png",
    "images/jordan_1_banner.png",
  ];

  const featured_loader = () => {
    // function to change the images in the featured section
    let merchandise = document.querySelector(".featured .merch img");
    let sale = document.querySelector(".featured .sale img");
    let latest = document.querySelector(".featured .latest img");
    if (mode === 1) {
      merchandise.src = "images/merch_dark.jpg";
      sale.src = "images/sale_dark.jpeg";
      latest.src = "images/latest_dark.jpeg";
    } else {
      merchandise.src = "images/merch_light.jpg";
      sale.src = "images/sale_light.jpg";
      latest.src = "images/latest_light.jpeg";
    }
  };

  featured_loader();

  const product_loader = (products_array, html_list) => {
    // function to load the products in the product section
    for (let i = 0; i < products_array.length; i++) {
      let product = products_array[i];
      let product_html = `
      <div data-aos="fade-up">
      <div class="card"  id="${product.id}">
            <div class="prod_img">
              <img src="${product.src}" alt="${product.name}" />
            </div>
            <div class="prod_details">
              <div class="info">
                <p>${product.name}</p>
                <p>$${product.price}</p>
              </div>
              <div class="wishlist_button_container">
              <svg
                class="add_to_cart"
                id=${product.id}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11H7V13H11V17H13V13H17V11H13V7H11V11Z"
                ></path>
              </svg>
              <svg
                class="add_to_wishlist"
                id=${product.id}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z"
                ></path>
              </svg>
            </div>
            </div>
          </div>
          </div>`;
      html_list.innerHTML += product_html;
    }

    card_loader();
  };

  const card_loader = () => {
    let cards = document.querySelectorAll(".card");
    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];

      let product_id = card.id;
      let product;
      product = products_list_heat.find((product) => product.id == product_id);
      if (product === undefined) {
        product = products_list_merchandise.find(
          (product) => product.id == product_id
        );
      }
      if (product === undefined) {
        product = products_list_basketball.find(
          (product) => product.id == product_id
        );
      }

      let prod_img = card.querySelector("img");
      prod_img.addEventListener("mouseenter", () => {
        prod_img.src = product.src2;
      });
      prod_img.addEventListener("mouseleave", () => {
        prod_img.src = product.src;
      });

      card.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay_close_function(document.querySelector(".login"));
        overlay_close_function(document.querySelector(".wishlist"));
        overlay_close_function(document.querySelector(".cart"));
        dropdown_close_function();

        let product_overlay = document.querySelector(".product_overlay");
        product_overlay.innerHTML = `
      <div class="header">
        <div class="heading">
          <h1>Product Details</h1>
        </div>
        <div class="product_close close_button">
          <svg xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"
            ></path>
          </svg>
        </div>
      </div>
      <div>
        <div class="prod_display">
          <div class="main_image">
            <img src="${product.src}" alt="${product.name}" />
          </div>
          <div class="thumbnails">
            <img
              class="active"
              src="${product.src}"
              alt="${product.name}"
            />
            <img src="${product.src2}" alt="${product.name}" />
            <img src="${product.src3}" alt="${product.name}" />
            <img src="${product.src4}" alt="${product.name}" />
          </div>
        </div>
        <div class="product_details">
          <p>${product.name}</p>
          <p>$${product.price}</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae,
            beatae!
          </p>

          <div class="rating">
            <p>
            <svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z"></path></svg>
            <svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z"></path></svg>
            <svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z"></path></svg>
            <svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z"></path></svg>
            <svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z"></path></svg></p>
          </div>
          
      <div class="buttons">
      <div class="add_to_cart_from_prod" id="${product.id}">
        <p>Add to cart</p>
      </div>
      <div class="add_to_wishlist_from_prod" id="${product.id}">
        <p>Add to wishlist</p>
      </div>
    </div>
        </div>
      </div>
      `;
        overlay_open_function(product_overlay);

        let stars = document.querySelectorAll(".star");
        for (let j = 0; j < product.review; j++) {
          stars[
            j
          ].innerHTML = `<path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>`;
          stars[j].style.setProperty("fill", "yellow");
        }

        let product_close = document.querySelector(".product_close");
        product_close.addEventListener("click", (e) => {
          overlay_close_function(product_overlay);
        });

        let thumbnails = document.querySelectorAll(".thumbnails img");
        for (let j = 0; j < thumbnails.length; j++) {
          let thumbnail = thumbnails[j];
          thumbnail.addEventListener("click", () => {
            let main_image = document.querySelector(".main_image img");
            main_image.src = thumbnail.src;
            for (let k = 0; k < thumbnails.length; k++) {
              thumbnails[k].classList.remove("active");
            }
            thumbnail.classList.add("active");
          });
        }

        let add_to_cart_buttons = document.querySelectorAll(
          ".add_to_cart_from_prod"
        );
        for (let j = 0; j < add_to_cart_buttons.length; j++) {
          let add_to_cart_button = add_to_cart_buttons[j];
          add_to_cart_button.addEventListener("click", (ev) => {
            ev.stopPropagation();
            if (!user) {
              overlay_close_function(product_overlay);
              overlay_open_function(login_overlay);
              return;
            }
            add_to_cart_button.style.setProperty(
              "background-color",
              "rgb(85, 255, 85)"
            );
            add_to_cart_button.style.setProperty("color", "white");
            add_to_cart_button.innerText = `Added to cart`;
            setTimeout(() => {
              add_to_cart_button.style.removeProperty("background-color");
              add_to_cart_button.innerText = "Add to cart";
              add_to_cart_button.style.removeProperty("color");
            }, 1000);
            cart_items_array.push(Number(add_to_cart_button.id));
            reload_cart();
          });
        }

        let add_to_wishlist_buttons = document.querySelectorAll(
          ".add_to_wishlist_from_prod"
        );
        for (let j = 0; j < add_to_wishlist_buttons.length; j++) {
          let add_to_wishlist_button = add_to_wishlist_buttons[j];
          add_to_wishlist_button.addEventListener("click", (ev) => {
            ev.stopPropagation();
            if (!user) {
              overlay_close_function(product_overlay);
              overlay_open_function(login_overlay);
              return;
            }
            add_to_wishlist_button.style.setProperty("background-color", "red");
            add_to_wishlist_button.style.setProperty("color", "white");
            add_to_wishlist_button.innerText = `Added to wishlist`;
            setTimeout(() => {
              add_to_wishlist_button.style.removeProperty("background-color");
              add_to_wishlist_button.innerText = "Add to wishlist";
              add_to_wishlist_button.style.removeProperty("color");
            }, 1000);
            wishlist_items_array.push(Number(add_to_wishlist_button.id));
            set_wishlist_buttons(wishlist_items_array);
            reload_wishlist();
          });
        }
      });
    }
  };

  let heat_list = document.querySelector(".heat .prod_list"); // heat products container from html file
  let merchandise_list = document.querySelector(".merchandise .prod_list"); // merchandise products container from html file
  let basketball_list = document.querySelector(".basketball .prod_list"); // basketball products container from html file
  product_loader(products_list_heat, heat_list); // loading the products in the heat section
  product_loader(products_list_merchandise, merchandise_list); // loading the products in the merchandise section
  product_loader(products_list_basketball, basketball_list); // loading the products in the basketball section

  let back_to_top = document.querySelector(".back_to_top"); // back to top button
  back_to_top.addEventListener("click", (e) => {
    // back to top button event listener
    e.stopPropagation();
    window.scrollTo(0, 0); // scroll to the top of the page
  });

  let logo = document.querySelector(".logo_nav");
  logo.addEventListener("click", (e) => {
    // back to top button event listener
    e.stopPropagation();
    window.scrollTo(0, 0); // scroll to the top of the page
  });

  window.addEventListener("scroll", () => {
    // event listener for the scroll event to show the back to top button
    let nav_backdrop = document.querySelector(".nav_backdrop");
    let nav = document.querySelector(".nav");
    let height = document.querySelector(".intro").offsetHeight;
    if (window.scrollY > height) {
      nav_backdrop.style.setProperty("opacity", "1");
      nav.style.removeProperty("color");
    } else {
      nav_backdrop.style.setProperty("opacity", "0");
      nav.style.setProperty("color", "white");
    }
    if (window.scrollY > 150) {
      back_to_top.style.setProperty("opacity", "0.8");
    } else {
      back_to_top.style.setProperty("opacity", 0);
    }
  });

  let menu = document.querySelector(".menu"); // menu container
  let dropdown = document.querySelector(".menu_dropdown"); // dropdown button
  dropdown.addEventListener("click", () => {
    // dropdown button event listener
    menu.style.setProperty("display", "flex"); // show the menu
    setTimeout(() => {
      // show the menu with a transition
      menu.style.setProperty("opacity", "1");
      menu.style.setProperty("top", "0px");
    });
  });
  const dropdown_close_function = () => {
    // function to close the dropdown menu
    menu.style.setProperty("opacity", "0"); // hide the menu with a transition
    menu.style.setProperty("top", "-300px");
    setTimeout(() => {
      menu.style.setProperty("display", "none"); // hide the menu
    }, 300);
  };

  let dropdown_close = document.querySelector(".dropdown_close"); // close button in the dropdown menu
  dropdown_close.addEventListener("click", dropdown_close_function); // close button event listener

  let overlay_close_function = (overlay) => {
    // function to close any overlay
    overlay.style.setProperty("opacity", "0");
    overlay.style.setProperty("transform", "translate(-50%,-50%) scale(0)");
    setTimeout(() => {
      overlay.style.setProperty("display", "none");
    }, 300);
  };

  let overlay_open_function = (overlay) => {
    // function to open any overlay
    overlay.style.setProperty("display", "flex");
    setTimeout(() => {
      overlay.style.setProperty("opacity", "1");
      overlay.style.setProperty("transform", "translate(-50%,-50%) scale(1)");
    });
    if (overlay == document.querySelector(".login")) {
      let inp = overlay.querySelector("#username");
      inp.focus();
    }
  };

  let inputs = Array.from(document.querySelectorAll("input")); // Get all input fields

  let wishlist_button = document.querySelector(".wishlist_button"); // wishlist overlay open button
  let wishlist_overlay = document.querySelector(".wishlist"); // wishlist overlay
  let wishlist_close = document.querySelector(".wishlist_close"); // wishlist overlay close button

  wishlist_button.addEventListener("click", function (event) {
    // wishlist button event listener
    event.stopPropagation();
    overlay_close_function(cart_overlay); // close the cart overlay (if open)
    dropdown_close_function(); // close the dropdown menu (if open)
    overlay_close_function(document.querySelector(".product_overlay"));
    overlay_open_function(wishlist_overlay);
    overlay_close_function(document.querySelector(".login"));
  });

  wishlist_close.addEventListener("click", function (event) {
    // wishlist close button event listener
    event.stopPropagation();
    overlay_close_function(wishlist_overlay);
  });

  let set_wishlist_buttons = (wishlist_items_array) => {
    // function to set the wishlist button to red if the product is in the wishlist
    let add_to_wishlist_buttons = document.querySelectorAll(".add_to_wishlist"); // wishlist buttons array
    for (let i = 0; i < add_to_wishlist_buttons.length; i++) {
      let flag = false; // flag to check if the product is in the wishlist
      for (let j = 0; j < wishlist_items_array.length; j++) {
        if (
          parseInt(wishlist_items_array[j]) ==
          parseInt(add_to_wishlist_buttons[i].id)
        ) {
          flag = true;
        }
      }
      if (flag) {
        // if the product is in the wishlist
        add_to_wishlist_buttons[i].style.setProperty("fill", "red");
        add_to_wishlist_buttons[
          i
        ].innerHTML = `<path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z"></path>`;
      } else {
        // if the product is not in the wishlist
        add_to_wishlist_buttons[i].style.removeProperty("fill");
        add_to_wishlist_buttons[i].innerHTML = `<path
        d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z"
      ></path>`;
      }
    }
  };

  const reload_wishlist = (n) => {
    // function to reload the wishlist items in the wishlist overlay
    wishlist_items_array = wishlist_items_array.map((e) => Number(e));
    if (n != 1) {
      async function updateWishlist() {
        try {
          let response = await fetch(`/updateWishlist`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user, wishlist_items_array }),
          });
          let data = await response.json();
          // console.log(data);
        } catch (err) {
          console.log(err);
        }
      }
      updateWishlist();
    }

    wishlist_items.innerHTML = ""; // clear the wishlist items
    if (wishlist_items_array.length === 0) {
      // if the wishlist is empty
      wishlist_items.innerHTML = `<p class="empty_wishlist empty">Your wishlist is empty</p>`;
    }
    let items_value = wishlist_items_array.length > 1 ? " items" : " item";
    wishlist_overlay.querySelector(".wishlist_count").innerHTML =
      wishlist_items_array.length + items_value; // set the wishlist count

    for (let i = 0; i < wishlist_items_array.length - 1; i++) {
      for (let j = i + 1; j < wishlist_items_array.length; j++) {
        if (wishlist_items_array[i] === Number(wishlist_items_array[j])) {
          wishlist_items_array.splice(j, 1);
        }
      }
    }
    for (let i = 0; i < wishlist_items_array.length; i++) {
      // loop through the wishlist items array
      let product = products_list_heat.find(
        // find the product in the heat products array
        (product) => product.id == Number(wishlist_items_array[i])
      );
      if (product === undefined) {
        product = products_list_merchandise.find(
          // find the product in the merchandise products array
          (product) => product.id == Number(wishlist_items_array[i])
        );
      }
      if (product === undefined) {
        product = products_list_basketball.find(
          // find the product in the basketball products array
          (product) => product.id == Number(wishlist_items_array[i])
        );
      }
      // add the product to the wishlist overlay
      wishlist_items.innerHTML += `<div class="wishlist_item item" > 
      <div class="prod_img">
        <img src="${product.src}" alt="${product.name}" />
      </div>
      <div class="details">
        <p>${product.name}</p>
        <p>$${product.price}</p>
        <div class="buttons">
          <div class="add_to_cart_from_wishlist" id=${product.id}>
            <p>Add to cart</p>
          </div>
          <div class="remove_from_wishlist" id=${product.id}>
            <p>Remove from wishlist</p>
          </div>
        </div>
      </div>
    </div>`;
    }

    let remove_from_wishlist_buttons = document.querySelectorAll(
      // remove from wishlist buttons array
      ".remove_from_wishlist"
    );
    for (let i = 0; i < remove_from_wishlist_buttons.length; i++) {
      // remove from wishlist button event listener
      let remove_from_wishlist_button = remove_from_wishlist_buttons[i];
      remove_from_wishlist_button.addEventListener("click", (ev) => {
        ev.stopPropagation();
        for (let j = 0; j < wishlist_items_array.length; j++) {
          if (
            Number(wishlist_items_array[j]) ===
            Number(remove_from_wishlist_button.id)
          ) {
            wishlist_items_array.splice(j, 1); // remove the product from the wishlist
            break;
          }
        }
        set_wishlist_buttons(wishlist_items_array); // set the wishlist buttons
        reload_wishlist(); // reload the wishlist items
      });
    }

    let add_to_cart_buttons = document.querySelectorAll(
      ".add_to_cart_from_wishlist"
    ); // add to cart buttons array
    for (let i = 0; i < add_to_cart_buttons.length; i++) {
      let add_to_cart_button = add_to_cart_buttons[i];
      add_to_cart_button.addEventListener("click", (ev) => {
        ev.stopPropagation();
        for (let j = 0; j < wishlist_items_array.length; j++) {
          if (
            Number(wishlist_items_array[j]) === Number(add_to_cart_button.id)
          ) {
            wishlist_items_array.splice(j, 1); // remove the product from the wishlist
            break;
          }
        }
        set_wishlist_buttons(wishlist_items_array); // set the wishlist buttons
        reload_wishlist(); // reload the wishlist items

        cart_items_array.push(Number(add_to_cart_button.id)); // add the product to the cart
        reload_cart(); // reload the cart items
      });
    }
  };

  let wishlist_items = document.querySelector(".wishlist_items"); // wishlist items container
  reload_wishlist(); // reload the wishlist items
  set_wishlist_buttons(wishlist_items_array); // set the wishlist buttons

  let add_to_wishlist_buttons = document.querySelectorAll(".add_to_wishlist"); //add to wishlist buttons array
  for (let i = 0; i < add_to_wishlist_buttons.length; i++) {
    let add_to_wishlist_button = add_to_wishlist_buttons[i];
    add_to_wishlist_button.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!user) {
        overlay_open_function(login_overlay);
        return;
      }
      overlay_close_function(document.querySelector(".login"));
      overlay_close_function(document.querySelector(".cart"));
      dropdown_close_function();
      overlay_close_function(document.querySelector(".product_overlay"));
      overlay_close_function(wishlist_overlay);
      // add to wishlist button event listener
      if (add_to_wishlist_button.style.fill === "red") {
        // if the product is in the wishlist remove it
        for (let j = 0; j < wishlist_items_array.length; j++) {
          if (
            parseInt(wishlist_items_array[j]) ===
            parseInt(add_to_wishlist_button.id)
          ) {
            //find the product in the wishlist array
            wishlist_items_array.splice(j, 1); // remove the product from the wishlist
            break;
          }
        }

        add_to_wishlist_button.innerHTML = `<path
        d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z"
      ></path>`;
        add_to_wishlist_button.style.removeProperty("fill");
      } else {
        // if the product is not in the wishlist add it
        wishlist_items_array.push(Number(add_to_wishlist_button.id));
        add_to_wishlist_button.innerHTML = `<path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z"></path>`;
        add_to_wishlist_button.style.setProperty("fill", "red");
      }
      reload_wishlist(); // reload the wishlist items
    });
  }

  let cart_button = document.querySelector(".cart_button"); // cart overlay open button
  let cart_overlay = document.querySelector(".cart"); // cart overlay
  let cart_close = document.querySelector(".cart_close"); // cart overlay close button

  cart_button.addEventListener("click", function (event) {
    // cart button event listener
    event.stopPropagation();
    dropdown_close_function(); // close the dropdown menu (if open)
    overlay_close_function(wishlist_overlay); // close the wishlist overlay (if open
    overlay_close_function(document.querySelector(".product_overlay"));
    overlay_open_function(cart_overlay);
    overlay_close_function(document.querySelector(".login"));
  });

  cart_close.addEventListener("click", function (event) {
    // cart close button event listener
    event.stopPropagation();
    overlay_close_function(cart_overlay);
  });

  const reload_cart = (n) => {
    cart_items_array = cart_items_array.map((e) => Number(e));
    // function to reload the cart items in the cart overlay
    if (n !== 1) {
      async function updateCart() {
        try {
          let response = await fetch(`/updateCart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user, cart_items_array }),
          });
          let data = await response.json();
          // console.log(data);
        } catch (err) {
          console.log(err);
        }
      }
      updateCart();
    }

    let cart_items = document.querySelector(".cart_items");
    let cart_footer = document.querySelector(".cart_footer");
    cart_items.innerHTML = "";
    if (cart_items_array.length === 0) {
      // if the cart is empty
      cart_items.innerHTML = `<p class="empty_cart empty">Your cart is empty</p>`;
      cart_footer.style.setProperty("display", "none");
    } else {
      cart_footer.style.setProperty("display", "flex");
    }
    let items_value = cart_items_array.length > 1 ? " items" : " item";
    cart_overlay.querySelector(".cart_count").innerHTML =
      cart_items_array.length + items_value; // set the wishlist count
    let cost = document.querySelector(".cost");
    cost.innerHTML = "";
    let total_price = 0;
    for (let i = 0; i < cart_items_array.length; i++) {
      let product = products_list_heat.find(
        (product) => product.id == Number(cart_items_array[i])
      );
      if (product === undefined) {
        product = products_list_merchandise.find(
          (product) => product.id == Number(cart_items_array[i])
        );
      }
      if (product === undefined) {
        product = products_list_basketball.find(
          (product) => product.id == Number(cart_items_array[i])
        );
      }
      total_price += product.price;
      cart_items.innerHTML += `<div class="cart_item item">
    <div class="prod_img">
      <img src="${product.src}" alt="${product.name}" />
    </div>
    <div class="details">
      <p>${product.name}</p>
      <p>$${product.price}</p>
      <div class="buttons">
        <div class="add_to_wishlist_from_cart" id=${product.id}>
          <p>Move to wishlist</p>
        </div>
        <div class="remove_from_cart" id=${product.id}>
          <p>Remove from cart</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
    }
    cost.innerHTML = `$${total_price}`;
    let remove_from_cart_buttons = document.querySelectorAll(
      // remove from wishlist buttons array
      ".remove_from_cart"
    );
    for (let i = 0; i < remove_from_cart_buttons.length; i++) {
      // remove from wishlist button event listener
      let remove_from_cart_button = remove_from_cart_buttons[i];
      remove_from_cart_button.addEventListener("click", (ev) => {
        ev.stopPropagation();
        for (let j = 0; j < cart_items_array.length; j++) {
          if (
            Number(cart_items_array[j]) === Number(remove_from_cart_button.id)
          ) {
            cart_items_array.splice(j, 1); // remove the product from the wishlist
            break;
          }
        }
        reload_cart(); // reload the wishlist items
      });
    }

    let add_to_wishlist_buttons = document.querySelectorAll(
      ".add_to_wishlist_from_cart"
    ); // add to wishlist buttons array
    for (let i = 0; i < add_to_wishlist_buttons.length; i++) {
      let add_to_wishlist_button = add_to_wishlist_buttons[i];
      add_to_wishlist_button.addEventListener("click", (ev) => {
        ev.stopPropagation();
        for (let j = 0; j < cart_items_array.length; j++) {
          if (
            Number(cart_items_array[j]) === Number(add_to_wishlist_button.id)
          ) {
            cart_items_array.splice(j, 1);
            break;
          }
        }
        reload_cart();
        wishlist_items_array.push(Number(add_to_wishlist_button.id));
        set_wishlist_buttons(wishlist_items_array); // set the wishlist buttons
        reload_wishlist();
      });
    }
  };

  reload_cart();

  let add_to_cart_buttons = document.querySelectorAll(".add_to_cart");
  for (let i = 0; i < add_to_cart_buttons.length; i++) {
    let add_to_cart_button = add_to_cart_buttons[i];
    add_to_cart_button.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!user) {
        overlay_open_function(login_overlay);
        return;
      }
      cart_items_array.push(Number(add_to_cart_button.id));
      reload_cart();
    });
  }

  let checkout_button = document.querySelector(".checkout");
  checkout_button.addEventListener("click", () => {
    cart_items_array = [];
    let order_successful = document.querySelector(".order_successful");
    order_successful.style.setProperty("display", "block");
    setTimeout(() => {
      order_successful.style.setProperty("opacity", "1");
      order_successful.style.setProperty(
        "transform",
        "translate(-50%,-50%) scale(1)"
      );
    });
    setTimeout(() => {
      order_successful.style.setProperty("opacity", "0");
      order_successful.style.setProperty(
        "transform",
        "translate(-50%,-50%) scale(0)"
      );
      setTimeout(() => {
        order_successful.style.setProperty("display", "hidden");
      }, 1000);
    }, 1000);

    reload_cart();
  });

  document.addEventListener("click", function (event) {
    // event listener to close the dropdown menu and  overlays when clicking outside them
    let isClickInsideMenu = menu.contains(event.target); // check if the click is inside the menu
    let isClickInsideWishlist = wishlist_overlay.contains(event.target); // check if the click is inside the wishlist overlay
    let isClickInsideCart = cart_overlay.contains(event.target); // check if the click is inside the cart overlay
    let isClickInsideLoginPage = login_overlay.contains(event.target); // check if the click is inside the login overlay
    let isClickInsideProduct = document
      .querySelector(".product_overlay")
      .contains(event.target); // check if the click is inside the product overlay

    if (!isClickInsideMenu && menu.style.opacity === "1") {
      // close the dropdown menu if the click is outside it
      dropdown_close_function();
    }

    if (!isClickInsideWishlist && wishlist_overlay.style.opacity === "1") {
      // close the wishlist overlay if the click is outside it
      overlay_close_function(wishlist_overlay);
    }

    if (!isClickInsideCart && cart_overlay.style.opacity === "1") {
      // close the cart overlay if the click is outside it
      overlay_close_function(cart_overlay);
    }

    if (!isClickInsideLoginPage && login_overlay.style.opacity === "1") {
      overlay_close_function(login_overlay);
    }

    if (
      !isClickInsideProduct &&
      document.querySelector(".product_overlay").style.opacity === "1" &&
      event.target.className !== "card"
    ) {
      overlay_close_function(document.querySelector(".product_overlay"));
    }
  });

  // -----paricles-js-------

  /* ---- particles.js config ---- */

  particlesJS("particles-js", {
    particles: {
      number: {
        value: 380,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: particleColor,
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          nb_sides: 5,
        },
        image: {
          src: "img/github.svg",
          width: 100,
          height: 100,
        },
      },
      opacity: {
        value: 1,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: false,
        distance: 150,
        color: particleColor,
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false,
          mode: "bubble",
        },
        onclick: {
          enable: false,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 100,
          size: 5,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  });
}

window.onload = async () => {
  await connectDB();
  await gettingProducts();
  await main();
  let preloader = document.querySelector(".preloader");
  preloader.style.setProperty("transform", "translateY(-100%)");
  preloader.style.setProperty("opacity", "0");
  setTimeout(() => {
    preloader.style.setProperty("display", "none");
  }, 300);
};
