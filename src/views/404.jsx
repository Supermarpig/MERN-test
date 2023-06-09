import React from 'react';
import styles from '../style/NotFound.module.scss';
import { Link } from 'react-router-dom'

function CustomNotFound() {
  const stars = Array.from({ length: 30 }, (_, index) => index);
  const notFound = '404 Page Not Found.';
  const backToHome = 'back to home';
  return (

    <>
      <div className={styles.container}>
        <div className={styles.sky}>
          {stars.map((index) => (
            <div key={index} className={styles.star}></div>
          ))}
        </div>

        <div className={styles.text_container}>
          <h1>
            {/* 404 not found text */}
            {[...notFound].map((char, index) => (
              <span key={index} className={styles.text}>
                {char.trim() || ' '}
              </span>
            ))}
          </h1>

          {/* back to home text */}
          <div className={styles.back2home}>
            <Link to="/home">
              {[...backToHome].map((char, index) => (
                <span key={index} className={styles.text}>
                  {char.trim() || ' '}
                </span>
              ))}
            </Link>
          </div>
        </div>

        {/* astronaut */}
        <div className={styles.boi}>
          <div className={styles.right_leg}></div>
          <div className={styles.left_leg}></div>
          <div className={styles.backpack}></div>
          <div className={styles.belly}></div>
          <div className={styles.eye}></div>
          <div className={styles.left_leg}></div>
        </div>

        <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg">
          <filter id="inset" x="-50%" y="-50%" width="200%" height="200%">
            <feFlood floodColor="black" result="outside-color" />
            <feMorphology in="SourceAlpha" operator="dilate" radius="3.5" />
            <feComposite
              in="outside-color"
              operator="in"
              result="outside-stroke"
            />
            <feFlood floodColor="#0c9fc4" result="inside-color" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="inside-stroke"
            />
            <feMerge>
              <feMergeNode in="outside-stroke" />
              <feMergeNode in="inside-stroke" />
            </feMerge>
          </filter>
        </svg>
      </div>
    </>

  );
}

export default CustomNotFound;