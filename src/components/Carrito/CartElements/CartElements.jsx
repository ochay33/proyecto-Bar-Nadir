import { useContext } from "react";
import { useState} from "react";
import { DataContext } from "../../DataContext/DataContext";
import Table from "react-bootstrap/Table"
import React from "react";
import axios from "axios";
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useData } from "../../DataContext/DataContext";
import Modal from "react-bootstrap/Modal";
import QR from "../../../img/codigoQRNadir.png";

import "../../../css/carrito.css"

export const CartElements = () => {
	const { cart, setCart } = useContext(DataContext);
  const { inputValue1, inputValue2} = useData();
  const [showDiv, setShowDiv] = useState(false);
  const [showDiv2, setShowDiv2] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    orderId: "",
    orderStatus: ""
  });
  
  const validationSchema = () =>
	    Yup.object().shape({
		    name: Yup.string()
			    .required("* Campo obligatorio")
			    .min(3, "El Nombre debe tener al menos 3 caracteres")
          .max(30, "El Nombre debe tener un maximo de  30 caracteres"),
		    phone: Yup.string()
		      .required("* Campo obligatorio")
		      .min(7, "El Telefono debe tener al menos 7 caracteres")
          .max(25, "El Telefono debe tener un maximo de 25 caracteres"),
        address: Yup.string()
          .required("* Campo obligatorio")
          .min(6, "La Direccion debe tener al menos 6 caracteres")
          .max(40, "La Direccion debe tener un maximo de 40 caracteres"),
        checkbox: Yup.string()
          .required("* Campo obligatorio")
             
    })

  const postUsuario = async () => {
        const order = {
          datos: formik.values,
          items: cart,
          detalles: inputValue1,
          cantidad: parseFloat(inputValue2),
          total: total(),
	}

	try {
    const resp = await axios.post(
      `${import.meta.env.VITE_SERVER_URI}/api/create-Orders`,
      order
    );

    const { status, data } = resp;

    if (status === 201) {
      setOrderInfo({
        orderId: data.id,
        orderStatus: data.estado,
      });
      setShowModal(true);
      clearCart();
      formik.resetForm();
    }
  } catch (error) {
    console.error("Error:", error);
  }
	};
  const total = () =>
    cart.reduce((acumulador, valorActual) => {
      const cantidad = valorActual.cantidad || 1;
      return acumulador + cantidad * valorActual.precio;
  }, 0);
    const onSubmit = () => {
      if (cart.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de comprar.");
      } else {
        if (!formik.isValid) {
          alert(
            "Por favor, completa todos los campos obligatorios de manera correcta."
          );
        } else {
          const numericInputValue2 = parseFloat(inputValue2);

          if (isNaN(numericInputValue2)) {
            alert("El valor ingresado no es válido. Ingresa un número.");
            return;
          }
          cart.forEach((producto) => {
            addCart(producto, numericInputValue2);
          });
          postUsuario();
          clearCart();
        }
      }
    };
    const formik = useFormik({
      initialValues: {
        name: "",   
        phone: "",  
        address: "",
        checkbox: false,
      },
      enableReinitialize: true,
      validationSchema,
      onSubmit,
    })
    const handlePagoOnline = () => {
      if (cart.length === 0 ) {
        alert("El carrito está vacío. Agrega productos antes de comprar.");
      }
      if (Object.keys(formik.values).length === 0){
        alert("El formulario está vacío");
      }
       else {
        if (Object.keys(formik.values).length === 0) {
          alert(
            "Por favor, completa todos los campos obligatorios de manera correcta."
          );
        } else {
          setShowDiv(true);
          setShowDiv2(false);
        }
      }   
    };
    const handleEnviarPedido = () => {
      if (cart.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de comprar.");
      } else {
        if (Object.keys(formik.values).length === 0) {
          alert(
            "Por favor, completa todos los campos obligatorios de manera correcta."
          );
        } else {
          postUsuario();
          clearCart();
          formik.resetForm();
          setShowDiv( false);
          setShowDiv2 (true); 
        }  
      }
    };

    const handleSubmit = () => {
      if (cart.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de comprar.");
      } else {
        if (Object.keys(formik.values).length === 0) {
          alert(
            "Por favor, completa todos los campos obligatorios de manera correcta."
          );
        } else {
          postUsuario();
          clearCart();
          formik.resetForm();
        }
      }
    };

	const removeItemFromCart = (id) => {
		setCart((prevCart) => prevCart.filter((item) => item.id !== id));
	}

    const clearCart = () => {
    setCart([]);
    formik.resetForm();
  
    };
        return ( 
            <>
            <Table id="responsive-table1" striped bordered hover variant="dark">
            <thead >
                <tr id="tr">
                    <th>Nombre</th>
                    <th id="img">img</th>
                    <th>Precio</th>
                    <th>Detalles del pedido</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
                {cart.map(producto => (
                    <tr key={producto.id}>
                        <td id="td" data-label="Titulo:">{producto.title}</td>
                        <td id="img">
                            <img
                                height={60}
                                src={producto.img}
                                alt={producto.title}
                            />
                        </td>
                        <td id="td" data-label="Precio:">{producto.precio}</td>
                        <td id="td" data-label="Detalles:">{producto.detalles}</td>
						            <td id="td" data-label="Cantidad:">{producto.cantidad}</td>
                        <td>
							              <Button variant="danger" onClick={() => removeItemFromCart(producto.id)}>								
                                 Eliminar
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td>Total</td>
                    <td></td>
                    <td>{total()}</td>
                    <td></td>
                    <td></td>
                </tr>
            </tfoot>
        </Table>
		    <Button variant="danger" onClick={clearCart}>
          Limpiar Carrito
        </Button>
		<br />
    <br />
		<Form onSubmit={formik.handleSubmit} className="responsive-form1"  style={{backgroundColor:"gray", color:"white", display:"flex", flexDirection:"column", padding:"20px", border:"1px solid #ccc"}}>
        <Form.Group  className="form-group1" controlId="formBasicName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            onChange={formik.handleChange}
            type="text"
            name="name"
            className={
              formik.errors.name &&
              formik.touched.name &&
              "error"
          }
            maxLength={30}
						minLength={3}
	 					value={formik.values.name}
	 					onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="errorMessage">{formik.errors.name}</div>
          )}
        </Form.Group>
        <Form.Group  className="form-group1" controlId="formBasicPhone">
          <Form.Label>Telefono</Form.Label>
          <Form.Control
            onChange={formik.handleChange}
            type="number"
            name="phone"
            className={
              formik.errors.phone &&
              formik.touched.phone &&
              "error"
          }
            maxLength={25}
						minLength={7}
	 					value={formik.values.phone}
	 					onBlur={formik.handleBlur}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="errorMessage">{formik.errors.phone}</div>
          )}  
        </Form.Group>
        <Form.Group  className="form-group1" controlId="formBasicAddress">
          <Form.Label>Direccion</Form.Label>
          <Form.Control
            onChange={formik.handleChange}
            type="address"
            name="address"
            className={
              formik.errors.address &&
              formik.touched.address &&
              "error"
          }
            maxLength={40}
						minLength={7}
	 					value={formik.values.address}
	 					onBlur={formik.handleBlur}
          />
          {formik.touched.address && formik.errors.address && (
            <div className="errorMessage">{formik.errors.address}</div>
          )}  
        </Form.Group>
        <Form.Group  className="form-group1" controlId="formBasicCheckbox">
          {showDiv2 &&(
          <div className="checkbox-label">
            <Form.Check 
              onChange={formik.handleChange}
              value={formik.values.checkbox}
              name="checkbox"
              type="checkbox" 
              label="Pago en efectivo"
              onBlur={formik.handleBlur}
              className={
                formik.errors.checkbox &&
                formik.touched.checkbox &&
                "error"} />
            {formik.touched.checkbox && formik.errors.checkbox && (
              <div className="errorMessage">{formik.errors.checkbox}</div>)} 
          </div>
          )}
        </Form.Group>
        {showDiv2 &&(
       <div>
       <br />
        <h6>Si tu pago es en efectivo haz click aqui</h6>
        <Button 
          id="efectivo"
          variant="primary" 
          className="btn btn-info btn-block mt-4"
          type="submit" 
          onClick={handleSubmit}
          disabled={!formik.isValid || cart.length === 0 || !formik.values.checkbox}>
          Pago en efectivo
        </Button>
        <Button
        disabled={!formik.isValid || cart.length === 0}
        variant="primary"
        className="btn btn-info btn-block mt-4"
        type="submit"
        onClick={handlePagoOnline}
        >
        Pago Online
        </Button>
        <br />
        <br />
        </div>
        )}
        {showDiv && (
        <div>
          <div className="enviar_pedido">
            <h6>Si finalizaste el pago online haz click aqui</h6>
            <Button
            variant="primary"
            type="submit"
            className="btn btn-info btn-block mt-4"
            onClick={handleEnviarPedido}
            disabled={!formik.isValid || cart.length === 0}
            >
            Enviar Pedido 
            </Button>
          </div>
          <br />
          <div className="qr-container">
              <img src={QR}  alt=""  />
          </div>
        </div>
        )}
    </Form>
        <Modal show={showModal} onHide={() =>setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Detalles de la Orden</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>¡Pedido Realizado Exitosamente!</p>
              <p>Demora aproximada 35 minutos</p>
              <p>ID de la Orden: {orderInfo.orderId}</p>
              <p>Estado de la Orden: {orderInfo.orderStatus}</p>
            </Modal.Body>
        </Modal>
        </>
    )
};