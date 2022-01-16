import { Card } from "antd";
import Chains from "components/Chains";
import { useChain } from "react-moralis";
import { Redirect } from "react-router-dom";
import { useMoralis } from "react-moralis";

export default function Pay(props) {
  const { chainId } = useChain();
  const { isAuthenticated } = useMoralis();

  return (
    <div
      style={{
        margin: "auto",
        display: "flex",
        gap: "20px",
        marginTop: "25",
        width: "70vw",
      }}
    >
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            payment
          </div>
        }
        size="large"
        style={{
          width: "100%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      ></Card>

      <section class="text-gray-600 body-font"></section>
      <section class="text-gray-600 body-font overflow-hidden">
        <div class="container px-5 py-24 mx-auto">
          <div class="lg:w-4/5 mx-auto flex flex-wrap">
            <div class="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <form method="get" id="imqm8">
                <h2 class="text-sm title-font text-gray-500 tracking-widest">
                  BRAND NAME
                </h2>
                <h1 class="text-gray-900 text-3xl title-font font-medium mb-4">
                  Animated Night Hill Illustrations
                </h1>
                <p class="leading-relaxed mb-4">
                  Fam locavore kickstarter distillery. Mixtape chillwave tumeric
                  sriracha taximy chia microdosing tilde DIY. XOXO fam inxigo
                  juiceramps cornhole raw denim forage brooklyn. Everyday carry
                  +1 seitan poutine tumeric. Gastropub blue bottle austin
                  listicle pour-over, neutra jean.
                </p>
                <div class="dropdown relative">
                  <button
                    class="
        dropdown-toggle
        inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out
        flex
        items-center
        whitespace-nowrap
      "
                    type="button"
                    id="dropdownMenuLargeButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Large button
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="caret-down"
                      class="w-2 ml-2"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path
                        fill="currentColor"
                        d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                      ></path>
                    </svg>
                  </button>
                  <ul
                    class="
        dropdown-menu
        min-w-max
        absolute
        hidden
        bg-white
        text-base
        z-50
        float-left
        py-2
        list-none
        text-left
        rounded-lg
        shadow-lg
        mt-1
        hidden
        m-0
        bg-clip-padding
        border-none
      "
                    aria-labelledby="dropdownMenuLargeButton"
                  >
                    <li>
                      <a
                        class="
            dropdown-item
            text-sm
            py-2
            px-4
            font-normal
            block
            w-full
            whitespace-nowrap
            bg-transparent
            text-gray-700
            hover:bg-gray-100
          "
                        href="#"
                      >
                        Action
                      </a>
                    </li>
                    <li>
                      <a
                        class="
            dropdown-item
            text-sm
            py-2
            px-4
            font-normal
            block
            w-full
            whitespace-nowrap
            bg-transparent
            text-gray-700
            hover:bg-gray-100
          "
                        href="#"
                      >
                        Another action
                      </a>
                    </li>
                    <li>
                      <a
                        class="
            dropdown-item
            text-sm
            py-2
            px-4
            font-normal
            block
            w-full
            whitespace-nowrap
            bg-transparent
            text-gray-700
            hover:bg-gray-100
          "
                        href="#"
                      >
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="flex border-t border-gray-200 py-2">
                  <span class="inline-flex items-center text-gray-500">
                    Size
                  </span>
                  <div class="ml-auto relative">
                    <select
                      type="text"
                      required
                      class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10"
                    >
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                      <option>X-Large</option>
                    </select>
                    <span class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        class="w-4 h-4"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>
                </div>
                <div class="flex border-t border-b mb-6 border-gray-200 py-2">
                  <span class="inline-flex items-center text-gray-500">
                    Quantity
                  </span>
                  <div class="ml-auto relative">
                    <select
                      type="text"
                      required
                      class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                    <span class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        class="w-4 h-4"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>
                </div>
                <div class="flex">
                  <span class="title-font font-medium text-2xl text-gray-900">
                    $58.00
                  </span>
                  <button
                    type="button"
                    class="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                  >
                    Button
                  </button>
                  <button
                    type="button"
                    class="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4"
                  >
                    <svg
                      fill="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      class="w-5 h-5"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
            <img
              alt="ecommerce"
              src="https://dummyimage.com/400x400"
              class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
