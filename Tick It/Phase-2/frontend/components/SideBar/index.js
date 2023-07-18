import React, { useState, useEffect } from "react";
import { Sidebar, Menu, useProSidebar } from "react-pro-sidebar";
import Image from "next/image";

import { getCategories } from "../../axios/event.axios";

import TickitButton from "../../components/tickitButton";

import styles from "./SideBar.module.scss";

export default function SideBar({ eventsFiltered }) {
  // States
  const [width, setWidth] = useState();
  const [categories, setCategories] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState(null); // State variable for the selected period
  const [categoryFilter, setCategoryFilter] = useState("");
  const [location, setLocation] = useState();
  const [search, setSearch] = useState("");

  // Hooks
  const { toggleSidebar } = useProSidebar();

  // Functions
  const getWidth = () => {
    let a = window.innerWidth;
    if (a > 991) {
      setWidth(a);
    }
  };

  const dateFilter = (period) => {
    const currentDate = new Date();

    if (period == "day") {
      // Set "from" date to the beginning of the current day (12:00 AM)
      const fromDateTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0
      );
      const fromFormattedDate = fromDateTime.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD

      // Set "to" date to the end of the current day (11:59 PM)
      const toDateTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59
      );
      const toFormattedDate = toDateTime.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
      setFromDate(fromFormattedDate);
      setToDate(toFormattedDate);
    } else if (period == "week") {
      const currentDay = currentDate.getDay();
      const startOfWeek = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDay,
        0,
        0,
        0
      );
      const fromFormattedDate = startOfWeek.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD

      // Calculate the end of the current week (Saturday)
      const endOfWeek = new Date(
        startOfWeek.getFullYear(),
        startOfWeek.getMonth(),
        startOfWeek.getDate() + 6,
        23,
        59,
        59
      );
      const toFormattedDate = endOfWeek.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD

      setFromDate(fromFormattedDate);
      setToDate(toFormattedDate);
    } else if (period == "month") {
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      // Set "from" date to the beginning of the current month
      const fromDateTime = new Date(currentYear, currentMonth, 1, 0, 0, 0);
      const fromFormattedDate = fromDateTime.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD

      // Set "to" date to the end of the current month
      const toDateTime = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
      const toFormattedDate = toDateTime.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
      setFromDate(fromFormattedDate);
      setToDate(toFormattedDate);
    } else {
      setFromDate("");
      setToDate("");
    }
  };

  const handlePeriodSelection = (period) => {
    setSelectedPeriod(period);
  };

  const handleCheckboxChange = (checkboxValue) => {
    if (categoryFilter.includes(checkboxValue)) {
      // If the checkbox value is already present in the state, remove it
      const updatedFilter = categoryFilter
        .split(",")
        .filter((value) => value !== checkboxValue)
        .join(",");
      setCategoryFilter(updatedFilter);
    } else {
      // If the checkbox value is not present in the state, add it
      const updatedFilter = categoryFilter
        ? categoryFilter + "," + checkboxValue
        : checkboxValue;
      setCategoryFilter(updatedFilter);
    }
  };

  // Use Effects
  useEffect(() => {
    getWidth();
    getCategories().then((data) => {
      setCategories(data.data);
    });
  }, []);

  return (
    <div className={styles.sideBar}>
      <Sidebar
        breakPoint="lg"
        backgroundColor={width > 991 ? "transparent" : "var(--background)"}
        width={width > 991 ? "100%" : "80%"}
      >
        <Menu className={styles.sidebarMenu}>
          <div className={styles.sideBarInputDiv}>
            <Image
              width={18}
              height={18}
              alt="search"
              src="/images/searchIcon.png"
            />
            <input
              type="text"
              // value={}
              placeholder="Search"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              required
              className={styles.sideBarInput}
            />
          </div>
          <div className={styles.sideBarInputDiv}>
            <Image
              width={14}
              height={20}
              alt="search"
              src="/images/mapIcon.png"
            />
            <input
              type="text"
              // value={}
              placeholder="Enter Location"
              onChange={(e) => {
                setLocation(e.target.value);
              }}
              required
              className={styles.sideBarInput}
            />
          </div>

          <div className={styles.dateFilterDiv}>
            <p className={styles.filterTitle}>Date</p>
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                alignItems: "center",
              }}
              onClick={() => {
                selectedPeriod != "day"
                  ? (dateFilter("day"), handlePeriodSelection("day"))
                  : (dateFilter("all"), handlePeriodSelection("all"));
              }}
            >
              <input
                className={styles.roundCheckbox}
                type="checkbox"
                checked={selectedPeriod === "day"}
              />
              <p className={styles.checkboxText}>Today</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                selectedPeriod != "week"
                  ? (dateFilter("week"), handlePeriodSelection("week"))
                  : (dateFilter("all"), handlePeriodSelection("all"));
              }}
            >
              <input
                className={styles.roundCheckbox}
                type="checkbox"
                checked={selectedPeriod === "week"}
              />
              <p className={styles.checkboxText}>This Week</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                selectedPeriod != "month"
                  ? (dateFilter("month"), handlePeriodSelection("month"))
                  : (dateFilter("all"), handlePeriodSelection("any"));
              }}
            >
              <input
                className={styles.roundCheckbox}
                type="checkbox"
                checked={selectedPeriod === "month"}
              />
              <p className={styles.checkboxText}>This Month</p>
            </div>
            <div className={styles.sideBarInputDiv}>
              <p className={styles.dateText}>From</p>
              <input
                id="myDateInput"
                type="date"
                value={fromDate}
                placeholder="Search"
                onChange={(e) => {
                  handlePeriodSelection("any"), setFromDate(e.target.value);
                }}
                required
                className={styles.sideBarInput}
                style={{ color: "#656565" }}
              />
            </div>
            <div className={styles.sideBarInputDiv}>
              <p className={styles.dateText}>To</p>
              <input
                type="date"
                value={toDate}
                placeholder="Search"
                onChange={(e) => {
                  handlePeriodSelection("any"), setToDate(e.target.value);
                }}
                required
                className={styles.sideBarInput}
                style={{ color: "#656565" }}
              />
            </div>
          </div>
          <div className={styles.dateFilterDiv}>
            <p className={styles.filterTitle}>Categories</p>
            {/* <div
              style={{
                display: 'flex',
                marginTop: '10px',
                alignItems: 'center',
              }}
            >
              <input
                className={styles.roundCheckbox}
                type="checkbox"
                onclick="myFunction()"
              />
              <p className={styles.checkboxText}>All</p>
            </div> */}

            {categories.map((category, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  className={styles.squareCheckbox}
                  type="checkbox"
                  onChange={() => handleCheckboxChange(category.id)}
                />
                <p className={styles.checkboxText}>{category.name}</p>
              </div>
            ))}
          </div>
          <div className={styles.filterButton}>
            <TickitButton
              text="Filter"
              onClick={() => {
                eventsFiltered(
                  categoryFilter,
                  location,
                  fromDate,
                  toDate,
                  search
                );
              }}
            />
          </div>
        </Menu>
      </Sidebar>
      <main style={{ display: "flex", padding: 10 }}>
        <div
          onClick={() => {
            toggleSidebar();
          }}
          className={`d-lg-none mx-auto mb-2`}
        >
          <Image
            alt="openmodal"
            src="/images/rightarrow.png"
            width="40"
            height="30"
          />
        </div>
      </main>
    </div>
  );
}
