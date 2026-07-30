import React, { useState } from "react";
import style from "./user.module.css";
import {useAuth} from "../../context/useAuth";
import {Link} from 'react-router-dom'

const TABS = {
  SEARCH_HISTORY: "SEARCH_HISTORY",
  INBOX: "INBOX",
  SHOP_HISTORY: "SHOP_HISTORY",
};


export default function UserProfile({ userName = "USER NAME", onBack }) {
  const [activeTab, setActiveTab] = useState(TABS.SEARCH_HISTORY);
  const {user} = useAuth();
  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.SEARCH_HISTORY:
        return (
          <>
            {/* <SearchHistory /> */}
            <p className={style.emptyState}>YOUR SEARCH HISTORY IS EMPTY</p>
          </>
        );
      case TABS.INBOX:
        return (
          <>
            {/* <Inbox /> */}
            <p className={style.emptyState}>YOUR INBOX IS EMPTY</p>
          </>
        );
      case TABS.SHOP_HISTORY:
        return (
          <>
            {/* <ShopHistory /> */}
            <p className={style.emptyState}>YOUR SHOP HISTORY IS EMPTY</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={style.page}>
      <Link to='/'><button className={style.backArrow} aria-label="Go back">{"↩"}</button>
</Link>
      <div className={style.card}>
        <h1 className={style.welcome}>WELCOME USER</h1>

        <p className={style.fieldLabel}> NAME : {user.name.toUpperCase()}</p>
        <p className={style.fieldValue}> USERNAME : {user.username}</p>

        <p className={style.description}>Add your shop to Niji and help more people discover your business. Create a strong online presence where nearby customers can easily find your shop, browse your products, and connect with you. Whether you're a small local store or a growing business, Niji makes it simple to reach the right audience and increase your visibility within your community.</p>

        <Link to='/add'><button className={style.addShopButton}>ADD YOUR SHOP</button></Link>
      </div>

      <div className={style.tabBar}>
        <button
          className={activeTab === TABS.SEARCH_HISTORY ? style.tabActive : style.tab}
          onClick={() => setActiveTab(TABS.SEARCH_HISTORY)}
        >
          SEARCH HISTORY
        </button>
        <button
          className={activeTab === TABS.INBOX ? style.tabActive : style.tab}
          onClick={() => setActiveTab(TABS.INBOX)}
        >
          INBOX
        </button>
        <button
          className={activeTab === TABS.SHOP_HISTORY ? style.tabActive : style.tab}
          onClick={() => setActiveTab(TABS.SHOP_HISTORY)}
        >
          SHOP HISTORY
        </button>
      </div>

      <div className={style.tabContent}>{renderTabContent()}</div>
    </div>
  );
}
