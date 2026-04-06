import React, { useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import "./index.css";
import dd_logo_h_rgb from "./assets/dd_logo_h_rgb.png";
import ServiceHead from "./components/service/ServiceHead";
import ServiceItem from "./components/service/ServiceItem";
import menu from "./assets/menu.png";
import { NavLink } from "react-router-dom";
import { useBlogData } from './context/Context';
import { datadogRum } from '@datadog/browser-rum'; 

const Header = () => {
  // Service categories data
  const serviceCategories = [
    {
      title: "Mobile Development",
      icon: "ri-smartphone-fill",
      items: [
        { name: "iOS", icon: "ri-apple-fill" },
        { name: "Android", icon: "ri-android-fill" },
        { name: "Cross-Platform", icon: "ri-device-line" }
      ]
    },
    {
      title: "Web Development",
      icon: "ri-computer-line",
      items: [
        { name: "Fullstack JS", icon: "ri-javascript-fill" },
        { name: "Ecommerce&CMS", icon: "ri-shopping-cart-2-line" },
        { name: "Magneto", icon: "ri-magnet-line" },
        { name: "Wordpress", icon: "ri-wordpress-fill" },
        { name: "Progressive Web App", icon: "ri-global-line" }
      ]
    },
    {
      title: "Animation Services",
      icon: "ri-movie-2-line",
      items: [
        { name: "Animation Services", icon: "ri-film-line" },
        { name: "Explainer Video", icon: "ri-video-line" }
      ]
    },
    {
      title: "BlockChain",
      icon: "ri-links-line",
      items: [
        { name: "Smart Contract", icon: "ri-file-list-3-line" },
        { name: "dApps", icon: "ri-apps-2-line" },
        { name: "Crypto Currency", icon: "ri-coin-line" }
      ]
    },
    {
      title: "Digital Marketing",
      icon: "ri-megaphone-line",
      items: [
        { name: "App Store Optimization", icon: "ri-store-2-line" },
        { name: "Social Media Optimization", icon: "ri-share-line" },
        { name: "Search Engine Optimization", icon: "ri-search-2-line" }
      ]
    }
  ];

  // Process items data
  const processItems = [
    { name: "Fixed Cost Project", icon: "ri-price-tag-3-line" },
    { name: "Talent On Demand", icon: "ri-team-line" },
    { name: "Product Engineering", icon: "ri-tools-line" }
  ];

  const functionLinks = [
    { name: 'Error Page', path: '/error-test', icon: 'ri-error-warning-line' },
    { name: 'Slow Loading', path: '/slow-loading', icon: 'ri-timer-line' },
    { name: 'Diagnostics', path: '/diagnostics', icon: 'ri-dashboard-line' },
  ];

  const performanceLinks = [
    { name: 'Measure', path: '/performance-test/measure', icon: 'ri-line-chart-line' },
    { name: 'Investigate', path: '/performance-test/investigate', icon: 'ri-search-line' },
  ];

  let service = useRef();
  let items = useRef();
  let outerDiv = useRef();
  let [toggle, setToggle] = useState(false);
  const functionsMenuList = useRef();
  const [functionsMenuToggle, setFunctionsMenuToggle] = useState(false);
  
  let serviceClick = () => {
    let dupToggle = !toggle;
    setToggle(dupToggle);

    // Close other menus when service opens
    if (dupToggle) {
      if (toggle2) {
        setToggle2(false);
        process.current.style.borderBottom = "2px solid transparent";
        proItems.current.style.height = "0px";
        proItems.current.style.paddingBottom = "0px";
      }
      if (functionsMenuToggle) {
        setFunctionsMenuToggle(false);
        if (functionsMenuList.current) {
          functionsMenuList.current.style.height = "0px";
        }
      }
      if (MobBlogToggle) {
        setMobkBlogToggle(false);
        if (mobBlogList.current) {
          mobBlogList.current.style.height = "0px";
        }
      }
      if (MobPerformanceToggle) {
        setMobPerformanceToggle(false);
        if (mobPerformanceList.current) {
          mobPerformanceList.current.style.height = "0px";
        }
      }
    }

    if (dupToggle) {
      service.current.style.borderBottom = "2px solid #FFB600";
      items.current.style.height = "fit-content";
      outerDiv.current.style.height = "70vh";
    } else {
      service.current.style.borderBottom = "2px solid transparent";
      items.current.style.height = "0px";
      outerDiv.current.style.height = "0px";
    }
  };

  let [toggle2, setToggle2] = useState(false);
  let process = useRef();
  let proItems = useRef();
  
  let processClick = () => {
    let dupli2Toggle = !toggle2;
    setToggle2(dupli2Toggle);

    // Close other menus when process opens
    if (dupli2Toggle) {
      if (toggle) {
        setToggle(false);
        service.current.style.borderBottom = "2px solid transparent";
        items.current.style.height = "0px";
        outerDiv.current.style.height = "0px";
      }
      if (functionsMenuToggle) {
        setFunctionsMenuToggle(false);
        if (functionsMenuList.current) {
          functionsMenuList.current.style.height = "0px";
        }
      }
      if (MobBlogToggle) {
        setMobkBlogToggle(false);
        if (mobBlogList.current) {
          mobBlogList.current.style.height = "0px";
        }
      }
      if (MobPerformanceToggle) {
        setMobPerformanceToggle(false);
        if (mobPerformanceList.current) {
          mobPerformanceList.current.style.height = "0px";
        }
      }
    }

    if (dupli2Toggle) {
      process.current.style.borderBottom = "2px solid #FFB600";
      proItems.current.style.height = "fit-content";
      proItems.current.style.paddingBottom = "5px";
    } else {
      process.current.style.borderBottom = "2px solid transparent";
      proItems.current.style.height = "0px";
      proItems.current.style.paddingBottom = "0px";
    }
  };

  let slideMenu = useRef();
  let [menuToggle, setMenuToggle] = useState(false);
  
  let menuClick = () => {
    let dupli3Toggle = !menuToggle;
    setMenuToggle(dupli3Toggle);
    if (dupli3Toggle) {
      slideMenu.current.style.height = "fit-content";
    } else {
      slideMenu.current.style.height = "0px";
      if (functionsMenuList.current) {
        functionsMenuList.current.style.height = "0px";
      }
      setFunctionsMenuToggle(false);
    }
  };

  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isFunctionsOpen, setIsFunctionsOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);

  // Close all other menus when one opens
  const handleServiceToggle = () => {
    setIsServiceOpen(prev => {
      const next = !prev;
      if (next) {
        setIsProcessOpen(false);
        setIsFunctionsOpen(false);
        setIsBlogOpen(false);
        setIsPerformanceOpen(false);
      }
      return next;
    });
  };

  const handleProcessToggle = () => {
    setIsProcessOpen(prev => {
      const next = !prev;
      if (next) {
        setIsServiceOpen(false);
        setIsFunctionsOpen(false);
        setIsBlogOpen(false);
        setIsPerformanceOpen(false);
      }
      return next;
    });
  };

  const handleFunctionsToggle = () => {
    setIsFunctionsOpen(prev => {
      const next = !prev;
      if (next) {
        setIsServiceOpen(false);
        setIsProcessOpen(false);
        setIsBlogOpen(false);
        setIsPerformanceOpen(false);
      }
      return next;
    });
  };

  const handleBlogToggle = () => {
    setIsBlogOpen(prev => {
      const next = !prev;
      if (next) {
        setIsServiceOpen(false);
        setIsProcessOpen(false);
        setIsFunctionsOpen(false);
        setIsPerformanceOpen(false);
      }
      return next;
    });
  };

  const handlePerformanceToggle = () => {
    setIsPerformanceOpen(prev => {
      const next = !prev;
      if (next) {
        setIsServiceOpen(false);
        setIsProcessOpen(false);
        setIsFunctionsOpen(false);
        setIsBlogOpen(false);
      }
      return next;
    });
  };


  let mobBlogList = useRef();
  let [MobBlogToggle, setMobkBlogToggle] = useState(false);

  let mobPerformanceList = useRef();
  let [MobPerformanceToggle, setMobPerformanceToggle] = useState(false);

  let mobBlogHandler = () => {
    let switchToggle = !MobBlogToggle;
    setMobkBlogToggle(switchToggle);

    // Close other menus when blog opens
    if (switchToggle) {
      if (toggle) {
        setToggle(false);
        service.current.style.borderBottom = "2px solid transparent";
        items.current.style.height = "0px";
        outerDiv.current.style.height = "0px";
      }
      if (toggle2) {
        setToggle2(false);
        process.current.style.borderBottom = "2px solid transparent";
        proItems.current.style.height = "0px";
        proItems.current.style.paddingBottom = "0px";
      }
      if (functionsMenuToggle) {
        setFunctionsMenuToggle(false);
        if (functionsMenuList.current) {
          functionsMenuList.current.style.height = "0px";
        }
      }
      if (MobPerformanceToggle) {
        setMobPerformanceToggle(false);
        if (mobPerformanceList.current) {
          mobPerformanceList.current.style.height = "0px";
        }
      }
    }

    if (switchToggle) {
      mobBlogList.current.style.height = "fit-content";
    } else {
      mobBlogList.current.style.height = "0px";
    }
  }

  const mobileFunctionsHandler = () => {
    const toggled = !functionsMenuToggle;
    setFunctionsMenuToggle(toggled);
    if (functionsMenuList.current) {
      functionsMenuList.current.style.height = toggled ? "fit-content" : "0px";
    }
    if (toggled) {
      if (toggle) {
        setToggle(false);
        service.current.style.borderBottom = "2px solid transparent";
        items.current.style.height = "0px";
        outerDiv.current.style.height = "0px";
      }
      if (toggle2) {
        setToggle2(false);
        process.current.style.borderBottom = "2px solid transparent";
        proItems.current.style.height = "0px";
        proItems.current.style.paddingBottom = "0px";
      }
      if (MobBlogToggle) {
        setMobkBlogToggle(false);
        if (mobBlogList.current) {
          mobBlogList.current.style.height = "0px";
        }
      }
      if (MobPerformanceToggle) {
        setMobPerformanceToggle(false);
        if (mobPerformanceList.current) {
          mobPerformanceList.current.style.height = "0px";
        }
      }
    }
  };

  const mobilePerformanceHandler = () => {
    const toggled = !MobPerformanceToggle;
    setMobPerformanceToggle(toggled);
    if (mobPerformanceList.current) {
      mobPerformanceList.current.style.height = toggled ? "fit-content" : "0px";
    }
    if (toggled) {
      if (toggle) {
        setToggle(false);
        service.current.style.borderBottom = "2px solid transparent";
        items.current.style.height = "0px";
        outerDiv.current.style.height = "0px";
      }
      if (toggle2) {
        setToggle2(false);
        process.current.style.borderBottom = "2px solid transparent";
        proItems.current.style.height = "0px";
        proItems.current.style.paddingBottom = "0px";
      }
      if (MobBlogToggle) {
        setMobkBlogToggle(false);
        if (mobBlogList.current) {
          mobBlogList.current.style.height = "0px";
        }
      }
      if (functionsMenuToggle) {
        setFunctionsMenuToggle(false);
        if (functionsMenuList.current) {
          functionsMenuList.current.style.height = "0px";
        }
      }
    }
  };

  const blogs = useBlogData();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('dd_current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name || parsed?.plan) {
          setCurrentUser(parsed);
          return;
        }
      }
      // fallback
      setCurrentUser(null);
    } catch (error) {
      setCurrentUser(null);
    }

    // Close all menus when navigating to a new page
    setIsServiceOpen(false);
    setIsProcessOpen(false);
    setIsFunctionsOpen(false);
    setIsBlogOpen(false);
    setIsPerformanceOpen(false);
  }, [location.pathname]);

  // Close all desktop menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside all menu dropdowns
      const isInsideMenu = event.target.closest('li');
      if (!isInsideMenu) {
        setIsServiceOpen(false);
        setIsProcessOpen(false);
        setIsFunctionsOpen(false);
        setIsBlogOpen(false);
        setIsPerformanceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generateRandomUser = () => {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Cameron', 'Dakota'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    const randomId = Math.floor(Math.random() * 10000) + 1000;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@standard-user.com`;

    return {
      id: randomId.toString(),
      name: name,
      email: email,
      plan: 'standard',
      hasPaid: false
    };
  };

  const handleResetSession = () => {
    try {
      // Stop current session
      datadogRum.stopSession();

      // Generate new random user
      const newUser = generateRandomUser();

      // Save to sessionStorage
      sessionStorage.setItem('dd_current_user', JSON.stringify(newUser));

      // Set new user in Datadog RUM
      datadogRum.setUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        plan: newUser.plan,
        hasPaid: newUser.hasPaid
      });

      // Update local state
      setCurrentUser(newUser);

      // Visual feedback
      alert(`Session reset! New user: ${newUser.name} (${newUser.email})`);

      // Reload the page to start fresh
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset session:', error);
      alert('Failed to reset session. Please check console for details.');
    }
  };

  const handleToggleUserPlan = () => {
    try {
      if (!currentUser) {
        alert('No user data found. Please reload the page.');
        return;
      }

      // Check if already upgraded
      if (currentUser.hasPaid) {
        alert('Already upgraded to Premium plan!');
        return;
      }

      const user = { ...currentUser };
      
      // Upgrade to premium (only from standard to premium)
      user.plan = 'premium';
      user.hasPaid = true;

      // Update sessionStorage
      sessionStorage.setItem('dd_current_user', JSON.stringify(user));
      
      // Update Datadog RUM user properties
      datadogRum.setUserProperty('plan', user.plan);
      datadogRum.setUserProperty('hasPaid', user.hasPaid);
      
      // Update local state
      setCurrentUser(user);
      
      // Visual feedback
      alert(`Successfully upgraded to ${user.plan.toUpperCase()} plan!`);
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      alert('Failed to upgrade plan. Please check console for details.');
    }
  };
  
  return (
    <div className="sticky z-[999] top-0 bg-white w-[100vw] px-4 max-w-[1700px] mx-auto">
      <div className="sticky z-[999] top-0 bg-white">
        <div className="flex w-full px-4 items-center justify-between bg-white">
          <NavLink
            to='/'
            onClick={() => {
              setIsServiceOpen(false);
              setIsProcessOpen(false);
              setIsFunctionsOpen(false);
              setIsBlogOpen(false);
              setIsPerformanceOpen(false);
            }}
          >
            <img
              className="logo w-[40vw] sm:w-[16rem] md:w-[12rem]"
              src={dd_logo_h_rgb}
              alt="Logo Image"
            />
          </NavLink>
          <i
            className={`menu text-[4.5vw] cursor-pointer sm:text-[1.8rem] hidden transition-all duration-300 ${
              menuToggle ? 'ri-close-line' : 'ri-menu-line'
            }`}
            onClick={menuClick}
          ></i>
          
          <div className="flex w-[78%] justify-between items-center">
            <ul className="flex items-center gap-2 xl:gap-3">
              <li
                onClick={handleServiceToggle}
                className="cursor-pointer text-[0.95rem] p-2 border-b-2 border-transparent hover:border-[#FFB600] hover:bg-[#FFF9E6] rounded-t-md transition-all duration-300"
              >
                <i className="ri-tools-fill mr-1.5"></i>Services
                <i className={`ri-arrow-down-s-fill ml-1 transition-transform duration-300 ${isServiceOpen ? 'rotate-180' : ''}`}></i>
                {isServiceOpen && (
                  <div className="bg-white border border-zinc-200 shadow-lg absolute top-[100%] left-[20%] grid grid-cols-3 px-4 py-4 gap-5 lg:gap-10 rounded-md">
                    {serviceCategories.map((category, index) => (
                      <ul key={index}>
                        <h3 className="text-[1rem] mb-2 font-semibold text-gray-800">
                          <i className={`${category.icon} mr-2 text-[#FFB600]`}></i>{category.title}
                        </h3>
                        {category.items.map((item, idx) => (
                          <li key={idx} className="text-[0.9rem] ml-3 mb-1 hover:text-[#FFB600] cursor-pointer transition-colors">
                            <i className={`${item.icon} mr-2`}></i>{item.name}
                          </li>
                        ))}
                      </ul>
                    ))}
                    <div className="flex justify-center mt-[-2rem] items-center">
                      <img className="h-[10rem]" src={menu} alt="Menu Image" />
                    </div>
                  </div>
                )}
              </li>

              {/* <li
                onClick={handleProcessToggle}
                className="relative cursor-pointer text-[0.95rem] p-2 border-b-2 border-transparent hover:border-[#FFB600] hover:bg-[#FFF9E6] rounded-t-md transition-all duration-300"
              >
                <i className="ri-settings-3-line mr-1.5"></i>Process
                <i className={`ri-arrow-down-s-fill ml-1 transition-transform duration-300 ${isProcessOpen ? 'rotate-180' : ''}`}></i>
                {isProcessOpen && (
                  <div className="absolute top-[180%] bg-white border border-zinc-200 shadow-lg z-50 rounded-md min-w-[250px]">
                    <ul className="flex flex-col">
                      {processItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFF9E6] cursor-pointer transition-colors">
                          <i className={`${item.icon} text-[#FFB600]`}></i>{item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li> */}

              <li className="cursor-pointer text-[0.95rem] p-2 border-b-2 border-transparent hover:border-[#FFB600] hover:bg-[#FFF9E6] rounded-t-md transition-all duration-300">
                <NavLink
                  to="/about"
                  onClick={() => {
                    setIsServiceOpen(false);
                    setIsProcessOpen(false);
                    setIsFunctionsOpen(false);
                    setIsBlogOpen(false);
                    setIsPerformanceOpen(false);
                  }}
                >
                  <i className="ri-information-line mr-1.5"></i>About
                </NavLink>
              </li>

              <li
                onClick={handleBlogToggle}
                className="cursor-pointer text-[0.95rem] p-2 border-b-2 border-transparent hover:border-[#FFB600] hover:bg-[#FFF9E6] rounded-t-md transition-all duration-300 relative"
              >
                <i className="ri-article-line mr-1.5"></i>Blogs
                <i className={`ri-arrow-down-s-fill ml-1 transition-transform duration-300 ${isBlogOpen ? 'rotate-180' : ''}`}></i>
                {isBlogOpen && (
                  <div className="absolute top-[180%] left-0 bg-white border border-zinc-200 shadow-lg z-50 rounded-md min-w-[200px]">
                    <ul className="flex flex-col">
                      {blogs.map((b, index) => (
                        <li key={index} className="hover:bg-[#FFF9E6] transition-colors">
                          <NavLink
                            to={`/blogs/${b.name.toLowerCase().replace(" ", "-")}`}
                            className="flex items-center gap-3 px-4 py-3 text-sm whitespace-nowrap"
                            onClick={() => {
                              setIsBlogOpen(false);
                              setIsPerformanceOpen(false);
                            }}
                          >
                            <i className="ri-book-marked-fill text-[#FFB600]"></i>
                            {b.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>

              <li
                onClick={handleFunctionsToggle}
                className="relative cursor-pointer text-[0.95rem] p-2 border-b-2 border-transparent hover:border-[#FFB600] hover:bg-[#FFF9E6] rounded-t-md transition-all duration-300"
              >
                <i className="ri-function-line mr-1.5"></i>Functions
                <i className={`ri-arrow-down-s-fill ml-1 transition-transform duration-300 ${isFunctionsOpen ? 'rotate-180' : ''}`}></i>
                {isFunctionsOpen && (
                  <div className="absolute top-[180%] bg-white border border-zinc-200 shadow-lg z-50 rounded-md min-w-[220px]">
                    <ul className="flex flex-col">
                      {functionLinks.map((item) => (
                        <li key={item.path} className="hover:bg-[#FFF9E6] transition-colors">
                          <NavLink
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3"
                            onClick={() => {
                              setIsServiceOpen(false);
                              setIsProcessOpen(false);
                              setIsFunctionsOpen(false);
                              setIsBlogOpen(false);
                              setIsPerformanceOpen(false);
                            }}
                          >
                            <i className={`${item.icon} text-[#FFB600]`}></i>
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>

              <li
                onClick={handlePerformanceToggle}
                className="relative cursor-pointer text-[0.95rem] p-2 border-b-2 border-transparent hover:border-[#FFB600] hover:bg-[#FFF9E6] rounded-t-md transition-all duration-300"
              >
                <i className="ri-speed-line mr-1.5"></i>Performance
                <i className={`ri-arrow-down-s-fill ml-1 transition-transform duration-300 ${isPerformanceOpen ? 'rotate-180' : ''}`}></i>
                {isPerformanceOpen && (
                  <div className="absolute top-[180%] bg-white border border-zinc-200 shadow-lg z-50 rounded-md min-w-[220px]">
                    <ul className="flex flex-col">
                      {performanceLinks.map((item) => (
                        <li key={item.path} className="hover:bg-[#FFF9E6] transition-colors">
                          <NavLink
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3"
                            onClick={() => {
                              setIsServiceOpen(false);
                              setIsProcessOpen(false);
                              setIsFunctionsOpen(false);
                              setIsBlogOpen(false);
                              setIsPerformanceOpen(false);
                            }}
                          >
                            <i className={`${item.icon} text-[#FFB600]`}></i>
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            </ul>

            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="text-xs text-right">
                    <p className="font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                      {currentUser.name || 'Guest'}
                    </p>
                  </div>
                  {currentUser.plan && (
                    <span className={`px-2 py-0.5 rounded text-[0.65rem] font-semibold uppercase ${
                      currentUser.plan === 'premium'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {currentUser.plan}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-500">
                  <p>Loading...</p>
                </div>
              )}
              <button
                onClick={handleToggleUserPlan}
                className="px-2.5 rounded-lg py-1.5 text-[0.75rem] border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 w-fit cursor-pointer whitespace-nowrap"
                title="Upgrade to Premium Plan"
              >
                <i className="ri-vip-crown-line mr-1"></i>Upgrade
              </button>
              <button
                onClick={handleResetSession}
                className="px-2.5 rounded-lg py-1.5 text-[0.75rem] border border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-300 w-fit cursor-pointer whitespace-nowrap"
                title="Reset Datadog Session"
              >
                <i className="ri-restart-line mr-1"></i>Reset
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className="mt-3 bg-white h-0 overflow-hidden transition-all duration-300" ref={slideMenu}>
          <ul className="mobileMenu px-4 flex flex-col gap-4 sm:gap-2 pb-4">
            <li
              className="text-[1rem] border-b-[2px] sm:text-[1.2rem] border-transparent hover:border-[#FCB714] p-2 rounded-md transition-all duration-200"
              onClick={serviceClick}
              ref={service}
            >
              <span className="cursor-pointer">
                <i className="ri-tools-fill mr-2"></i>Services
              </span>
              <i className={`ri-arrow-down-s-fill cursor-pointer ml-2 transition-transform duration-300 ${toggle ? 'rotate-180' : ''}`}></i>
              <div className="overflow-y-scroll service-menu h-0" ref={outerDiv}>
                <div className="border border-zinc-400 w-full h-0 overflow-hidden rounded-md mt-2" ref={items}>
                  {serviceCategories.map((category, index) => (
                    <div key={index} className="p-4 sm:px-14">
                      <ServiceHead head={category.title} />
                      {category.items.map((item, idx) => (
                        <ServiceItem key={idx} item={item.name} />
                      ))}
                    </div>
                  ))}
                  <img className="w-[60%] sm:w-[20rem] mx-auto" src={menu} alt="Menu Image" />
                </div>
              </div>
            </li>
            
            <li
              className="text-[1rem] border-b-[2px] sm:text-[1.2rem] border-transparent hover:border-[#FCB714]  p-2 rounded-md transition-all duration-200"
              ref={process}
              onClick={processClick}
            >
              <span className="cursor-pointer">
                <i className="ri-settings-3-line mr-2"></i>Process
              </span>
              <i className={`cursor-pointer ri-arrow-down-s-fill ml-2 transition-transform duration-300 ${toggle2 ? 'rotate-180' : ''}`}></i>
              <div className="overflow-hidden pb-[0px] h-0" ref={proItems}>
                <ul className="proMenu mt-2">
                  {processItems.map((item, index) => (
                    <li key={index} className="text-lg flex items-center p-2 hover:bg-[#FFF9E6] rounded-md">
                      <i className={`${item.icon} text-xl mr-3 text-[#FFB600]`}></i>{item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            
            <li className="text-[1rem] sm:text-[1.2rem] border-b-[2px] border-transparent cursor-pointer hover:border-[#FCB714] p-2 transition-all duration-200">
              <NavLink
                to="/about"
                onClick={() => {
                  setToggle(false);
                  setToggle2(false);
                  setMobkBlogToggle(false);
                  setFunctionsMenuToggle(false);
                  setMenuToggle(false);
                  if (service.current) service.current.style.borderBottom = "2px solid transparent";
                  if (items.current) items.current.style.height = "0px";
                  if (outerDiv.current) outerDiv.current.style.height = "0px";
                  if (process.current) process.current.style.borderBottom = "2px solid transparent";
                  if (proItems.current) {
                    proItems.current.style.height = "0px";
                    proItems.current.style.paddingBottom = "0px";
                  }
                  if (mobBlogList.current) mobBlogList.current.style.height = "0px";
                  if (functionsMenuList.current) functionsMenuList.current.style.height = "0px";
                  if (slideMenu.current) slideMenu.current.style.height = "0px";
                }}
              >
                About Us
              </NavLink>
            </li>

            <li 
              onClick={mobBlogHandler} 
              className="cursor-pointer text-[1rem] sm:text-[1.2rem] border-b-[2px] border-transparent hover:border-[#FCB714] p-2 transition-all duration-200"
            >
              Blogs
              <i className={`cursor-pointer ri-arrow-down-s-fill ml-2 transition-transform duration-300 ${MobBlogToggle ? 'rotate-180' : ''}`}></i>
              <div ref={mobBlogList} className="overflow-hidden pb-[0px] h-0">
                <ul className="mt-2">
                  {blogs.map((b, index) => {
                    return (
                      <li key={index} className="text-lg ml-3 mb-2 hover:text-[#FFB600] cursor-pointer transition-colors">
                        <NavLink
                          to={`/blogs/${b.name.toLowerCase().replace(" ", "-")}`}
                          onClick={() => {
                            setMobkBlogToggle(false);
                            setMenuToggle(false);
                            if (mobBlogList.current) mobBlogList.current.style.height = "0px";
                            if (slideMenu.current) slideMenu.current.style.height = "0px";
                          }}
                        >
                          <i className="mr-2 ri-book-marked-fill text-[#FFB600]"></i>{b.name}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>

            <li
              onClick={mobileFunctionsHandler}
              className="text-[1rem] sm:text-[1.2rem] border-b-[2px] border-transparent cursor-pointer hover:border-[#FCB714] p-2 transition-all duration-200"
            >
              Functions
              <i className={`cursor-pointer ri-arrow-down-s-fill ml-2 transition-transform duration-300 ${functionsMenuToggle ? 'rotate-180' : ''}`}></i>
              <div ref={functionsMenuList} className="overflow-hidden pb-[0px] h-0">
                <ul className="mt-2">
                  {functionLinks.map((item) => (
                    <li key={item.path} className="text-lg ml-3 mb-2 hover:text-[#FFB600] cursor-pointer transition-colors">
                      <NavLink
                        to={item.path}
                        onClick={() => {
                          setFunctionsMenuToggle(false);
                          if (functionsMenuList.current) {
                            functionsMenuList.current.style.height = "0px";
                          }
                          setMenuToggle(false);
                          if (slideMenu.current) {
                            slideMenu.current.style.height = "0px";
                          }
                        }}
                      >
                        <i className={`mr-2 ${item.icon} text-[#FFB600]`}></i>
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li
              onClick={mobilePerformanceHandler}
              className="text-[1rem] sm:text-[1.2rem] border-b-[2px] border-transparent cursor-pointer hover:border-[#FCB714] p-2 transition-all duration-200"
            >
              Performance
              <i className={`cursor-pointer ri-arrow-down-s-fill ml-2 transition-transform duration-300 ${MobPerformanceToggle ? 'rotate-180' : ''}`}></i>
              <div ref={mobPerformanceList} className="overflow-hidden pb-[0px] h-0">
                <ul className="mt-2">
                  {performanceLinks.map((item) => (
                    <li key={item.path} className="text-lg ml-3 mb-2 hover:text-[#FFB600] cursor-pointer transition-colors">
                      <NavLink
                        to={item.path}
                        onClick={() => {
                          setMobPerformanceToggle(false);
                          if (mobPerformanceList.current) {
                            mobPerformanceList.current.style.height = "0px";
                          }
                          setMenuToggle(false);
                          if (slideMenu.current) {
                            slideMenu.current.style.height = "0px";
                          }
                        }}
                      >
                        <i className={`mr-2 ${item.icon} text-[#FFB600]`}></i>
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <div className="flex flex-col gap-3">
              {currentUser ? (
                <>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">User:</span> {currentUser.name || 'Guest'}
                  </p>
                  {currentUser.plan && (
                    <p className="text-sm text-gray-500 uppercase">Plan: {currentUser.plan}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">Fetching user...</p>
              )}
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleToggleUserPlan}
                  className="w-full px-3 rounded-lg py-1.5 text-xs border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer"
                  title="Upgrade to Premium Plan"
                >
                  <i className="ri-vip-crown-line mr-1.5"></i>Upgrade Plan
                </button>
                <button 
                  onClick={handleResetSession}
                  className="w-full px-3 rounded-lg py-1.5 text-xs border border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-300 cursor-pointer"
                  title="Reset Datadog Session"
                >
                  <i className="ri-restart-line mr-1.5"></i>Reset Session
                </button>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;