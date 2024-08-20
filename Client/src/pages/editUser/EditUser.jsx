import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/TranbolicoContextProvider";
import { Button, Col, Form, Row } from "react-bootstrap";
import "./editUser.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserAvatar } from "../../components/UserAvatar/UserAvatar";

export const EditUser = () => {
  const { globalState, setGlobalState, loading } = useContext(AppContext);
  const [editedUser, setEditedUser] = useState({});
  const [files, setFiles] = useState();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && globalState.user) {
      setEditedUser(globalState.user);
    }
  }, [loading, globalState.user]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleFilesChange = (e) => {
    setFiles(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    editedUser.name =
      editedUser.name.trimStart() === ""
        ? globalState.user.name
        : editedUser.name;
    editedUser.surname =
      editedUser.surname.trimStart() === ""
        ? globalState.user.surname
        : editedUser.surname;
    editedUser.email =
      editedUser.email.trimStart() === ""
        ? globalState.user.email
        : editedUser.email;
    editedUser.phone_number =
      editedUser.phone_number.trimStart() === ""
        ? globalState.user.phone_number
        : editedUser.phone_number;
    editedUser.province_name =
      editedUser.province_name.trimStart() === ""
        ? globalState.user.province_name
        : editedUser.province_name;
    editedUser.city_name =
      editedUser.city_name.trimStart() === ""
        ? globalState.user.city_name
        : editedUser.city_name;

    console.log("onSubmit: after sanitization =", editedUser);

    try {
      const newFormData = new FormData();
      newFormData.append("editedUser", JSON.stringify(editedUser));

      if (files) {
        console.log("onSubmit: adding file to FormData");
        newFormData.append("file", files);
      }

      console.log("onSubmit: sending request to backend");

      const res = await axios.put(
        "http://localhost:4000/users/editOneUser",
        newFormData,
        {
          headers: { Authorization: `Bearer ${globalState.token}` },
        }
      );

      console.log("onSubmit: response from backend =", res);

      if (res.data.image) {
        setEditedUser({ ...editedUser, avatar: res.data.image });
        setGlobalState((prev) => ({
          ...prev,
          user: { ...prev.user, avatar: res.data.image },
        }));
        console.log(
          "onSubmit: updated editedUser with new image =",
          res.data.image
        );
      } else {
        setEditedUser(editedUser);
        setGlobalState((prev) => ({ ...prev, user: editedUser }));
        console.log("onSubmit: updated editedUser without new image");
      }

      console.log("onSubmit: final state of editedUser =", editedUser);
    } catch (err) {
      console.error("Error al enviar la solicitud:", err);
    }
    navigate("/profile");
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      surname: "",
      email: "",
      phone_number: "",
      birthdate: "",
      province: "",
      city: "",
      password: "",
      password2: "",
    };

    //Validamos
    /* if (!editedUser.name) {
      newErrors.name = "El nombre es obligatorio";
      valid = false;
    } else  */
    if (editedUser.name.length < 3 || editedUser.name.length > 15) {
      newErrors.name = "El nombre debe contener entre 3 y 15 caracteres";
      valid = false;
    }

    //Validamos apellido
    /* if (!editedUser.surname) {
      newErrors.surname = "El apellido es obligatorio";
      valid = false;
    } else  */
    if (editedUser.surname.length < 3 || editedUser.surname.length > 40) {
      newErrors.surname = "El nombre debe contener entre 3 y 40 caracteres";
      valid = false;
    }

    //Validamos email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;
    /* if (!editedUser.email) {
      newErrors.email = "El email es obligatorio";
      valid = false;
    } else  */
    if (editedUser.email.length > 320) {
      newErrors.surname = "El email debe contener como máximo 320 caracteres";
      valid = false;
    } else if (!emailPattern.test(editedUser.email)) {
      newErrors.email = "Formato de email no válido";
      valid = false;
    }

    //Validamos teléfono
    /* if (!editedUser.phone_number) {
      newErrors.phone_number = "El teléfono es obligatorio";
      valid = false;
    } else  */
    if (editedUser.phone_number.length > 25) {
      newErrors.phone_number =
        "El teléfono debe contener como máximo 25 caracteres";
      valid = false;
    }

    //Validamos provincia
    /*  if (!editedUser.province) {
      newErrors.province = "La provincia es obligatoria";
      valid = false;
    }

    //Validamos ciudad
    if (!editedUser.city) {
      newErrors.city = "La ciudad es obligatoria";
      valid = false;
    } */

    setErrors(newErrors);
    return valid;
  };

  return (
    <>
      <Row className="justify-content-center align-items-center pt-5">
        <div className="user-avatar-container">
          <UserAvatar user={editedUser} size={120} />
        </div>
        <div className="contenedor-edit d-flex justify-content-center align-items-center mb-5">
          <Col xs={12} md={8} lg={6} xl={4}>
            <Form>
              <div className="ppal-edit text-center">
                <h2>EDITAR</h2>
              </div>

              <Form.Group className="mb-2" controlId="formBasicName">
                <Form.Control
                  className="input-form-edit"
                  type="text"
                  placeholder="Nombre"
                  name="name"
                  value={editedUser?.name}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.name && (
                <p className="text-center text-danger fw-bold">{errors.name}</p>
              )}

              <Form.Group className="mb-2" controlId="formBasicSurname">
                <Form.Control
                  className="input-form-edit"
                  type="text"
                  placeholder="Apellidos"
                  name="surname"
                  value={editedUser?.surname}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.surname && (
                <p className="text-center text-danger fw-bold">
                  {errors.surname}
                </p>
              )}

              <Form.Group className="mb-2" controlId="formBasicEmail">
                <Form.Control
                  className="input-form-edit"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={editedUser?.email}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.email && (
                <p className="text-center text-danger fw-bold">
                  {errors.email}
                </p>
              )}

              <Form.Group className="mb-2" controlId="formBasicPhoneNumber">
                <Form.Control
                  className="input-form-edit"
                  type="tel"
                  placeholder="Teléfono"
                  name="phone_number"
                  value={editedUser?.phone_number}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.phone_number && (
                <p className="text-center text-danger fw-bold">
                  {errors.phone_number}
                </p>
              )}

              <Form.Group className="mb-2" htmlFor="selectGenre">
                <Form.Control
                  className="input-form-edit"
                  id="selectGenre"
                  as="select"
                  name="genre"
                  value={editedUser.genre || ""}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="1">Masculino</option>
                  <option value="2">Femenino</option>
                  <option value="3">Otro</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-2" controlId="formBasicProvince">
                <Form.Control
                  className="input-form-edit"
                  type="text"
                  placeholder="Provincia"
                  name="province_name"
                  value={editedUser?.province_name}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.province && (
                <p className="text-center text-danger fw-bold">
                  {errors.province}
                </p>
              )}

              <Form.Group className="mb-2" controlId="formBasicCity">
                <Form.Control
                  className="input-form-edit"
                  type="text"
                  placeholder="Ciudad"
                  name="city_name"
                  value={editedUser?.city_name}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.city && (
                <p className="text-center text-danger fw-bold">{errors.city}</p>
              )}

              <Form.Group className="mb-2" controlId="formBasicImg">
                <Form.Control
                  type="file"
                  name="avatar"
                  onChange={handleFilesChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-center gap-2">
                <Button
                  className="btn-iniciar-login aceptar border-0 fst-italic"
                  onClick={onSubmit}
                >
                  Aceptar
                </Button>
                <Button
                  className="btn-volver-login cancelar border-0 fst-italic"
                  onClick={() => navigate("/profile")}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          </Col>
        </div>
      </Row>
    </>
  );
};
