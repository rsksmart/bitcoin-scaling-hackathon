import { useRouter } from "next/router";
import { Container, Row } from "react-bootstrap";

import { EffectFade, Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import "swiper/scss/scrollbar";
import "swiper/scss/effect-fade";

import TickitButton from "../tickitButton";

import styles from "./Slider.module.scss";

export default function Slider({ events }) {
  const router = useRouter();
  if (events)
    return (
      <Swiper
        modules={[
          EffectFade,
          Navigation,
          Pagination,
          Scrollbar,
          A11y,
          Autoplay,
        ]}
        spaceBetween={0}
        slidesPerView={1}
        effect={"fade"}
        className={styles.wrapper}
        pagination={{ clickable: true }}
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        speed={1000}
      >
        {events?.slice(0, 4).map((item, k) => (
          <SwiperSlide
            key={k}
            style={{
              backgroundImage: `url(${item?.banner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={styles.shadow}>
              <Container className={styles.sliderContainer}>
                <Row>
                  <h1>{item?.name} </h1>
                  <p>{item?.description}</p>
                  <div>
                    <TickitButton
                      text="Reserve"
                      onClick={() => {
                        router.push(`/event/${item?.slug}`);
                      }}
                    />
                  </div>
                </Row>
              </Container>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  else return <div className={styles.wrapper}></div>;
}
