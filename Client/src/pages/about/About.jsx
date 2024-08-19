import React from 'react';
import { Row, Col } from 'react-bootstrap';
import "../../App.css";
import "./About.scss";

export const About = () => {
  return (
    <div>
      <Row className="conocenos align-items-center">
        <Col xs={8}>
          <span>Conócenos</span>
        </Col>
        <Col xs={4} className="d-flex align-items-center justify-content-end">
          <img src="/images/Trambólico2.png" alt="Trambolico2" />
        </Col>
      </Row>
      <div className="como-funciona">
        <h3>¿Cómo funciona?</h3>
        <Row className="funciona-content">
          <Col xs={12} md={6} className="funciona-item">
            <div className="funciona-point">
              <span className="funciona-number">1</span>
            </div>
            <div className="funciona-text">
              <h2>Elige trayecto y horario de recogida</h2>
              <span>Escoge desde dónde necesitas trasladarte hacia Castellón en el horario que mejor te convenga.</span>
            </div>
          </Col>
          <Col xs={12} md={6} className="funciona-item">
            <div className="funciona-point">
              <span className="funciona-number">2</span>
            </div>
            <div className="funciona-text">
              <h2>Añade tu complemento</h2>
              <span>Escoge el complemento que necesitas para tu viaje.</span>
            </div>
          </Col>
          <Col xs={12} md={6} className="funciona-item">
            <div className="funciona-point">
              <span className="funciona-number">3</span>
            </div>
            <div className="funciona-text">
              <h2>Elige trayecto y horario de vuelta</h2>
              <span>Escoge desde dónde necesitas trasladarte hacia Castellón en el horario que mejor te convenga.</span>
            </div>
          </Col>
          <Col xs={12} md={6} className="funciona-item">
            <div className="funciona-point">
              <span className="funciona-number">4</span>
            </div>
            <div className="funciona-text">
              <h2>Realiza el pago</h2>
              <span>Una vez definido el complemento y trayecto, solo queda hacer el pago y empezar a disfrutar de la vuelta a casa sin esperas.</span>
            </div>
          </Col>
        </Row>
      </div>
      <Row className="Amarillo align-items-center">
        <Col xs={4} className="d-flex align-items-center justify-content-start">
          <img src="/images/Trambólico11.png" alt="Trambolico11" />
        </Col>
        <Col xs={8}>
          <h3>¿Qué dicen de nosotros?</h3>
        </Col>
      </Row>
      <Row className="testimonios">
        <Col xs={12} md={6} className="d-flex align-items-start">
          <div className="testimonio">
            <p>Descubre nuestra oferta de actividades, ocio, y restauración a las que asistir el día que contrates el trayecto.</p>
          </div>
        </Col>
        <Col xs={12} md={6} className="d-flex align-items-start">
          <div className="testimonio">
            <p>Descubre nuestra oferta de actividades, ocio, y restauración a las que asistir el día que contrates el trayecto.</p>
          </div>
        </Col>
        <Col xs={12} md={6} className="d-flex align-items-start">
          <div className="testimonio">
            <p>Descubre nuestra oferta de actividades, ocio, y restauración a las que asistir el día que contrates el trayecto.</p>
          </div>
        </Col>
        <Col xs={12} md={6} className="d-flex align-items-start">
          <div className="testimonio">
            <p>Descubre nuestra oferta de actividades, ocio, y restauración a las que asistir el día que contrates el trayecto.</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};
