import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './test.module.css';
import Loading from '../../components/loading/loading';

const Test = () => {

  return (
    <main className={style.page}>
      <Loading/>
    </main>
  );
};

export default Test;
