import { useEffect, useState } from "react"
import { Button, Col, CustomInput, Form, FormGroup, Input, Label, Modal, ModalFooter, Row } from "reactstrap"
import Select from "react-select"
import ModalBody from "reactstrap/lib/ModalBody"
import ModalHeader from "reactstrap/lib/ModalHeader"
import PasswordStrengthBar from "react-password-strength-bar"
import api from "../../../services/api"
import { toast } from "react-toastify"

const ModalUsers = (props) => {
  const { isOpen, dataToEdit, handleToggle, handleUpdate } = props
  const [password, testPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }

  const [userData, setUserData] = useState({})

  const initialStateFields = {
    usuario: "",
    login: "",
    email: "",
    perfil: "",
    senha: "",
    status: 1
  }
  const [fields, setFields] = useState(initialStateFields)

  useEffect(() => {
    if (!isOpen) return
    if (Object.keys(dataToEdit).length === 0) return setFields(initialStateFields)

    setFields({
      id: dataToEdit.id,
      usuario: dataToEdit.usuario,
      login: dataToEdit.login,
      email: dataToEdit.email,
      perfil: dataToEdit.perfil,
      senha: dataToEdit.senha,
      status: dataToEdit.status
    })
  }, [dataToEdit])

  async function create() {
    console.log(fields)
    await api
      .post("usuarios", fields)
      .then((response) => {
        if (response.data.error) {
          toast.error("Ocorreu um erro no servidor")
        } else {
          toast.success("Registro inserido com sucesso!")
          handleToggle()
          handleUpdate()
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error("Ocorreu um erro")
        console.log(error)
      })
  }

  async function update() {
    console.log(fields)
    await api
      .patch(`usuarios/${fields.id}`, fields)
      .then((response) => {
        if (response.status !== 200) {
          toast.error("Ocorreu um erro no servidor")
        } else {
          toast.success(response.data.message)
          handleToggle()
          handleUpdate()
          setLoading(false)
        }
      })
      .catch((error) => {
        toast.error("Ocorreu um erro")
        setLoading(false)
        console.log(error)
      })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    if (dataToEdit.id) {
      await update()
    } else {
      await create()
    }
  }

  const profileOptions = [
    { value: "Master", label: "Master" },
    { value: "Editor", label: "Editor" },
    { value: "Usuário", label: "Usuário" }
  ]

  /*
  const Profile = () => {
    if (userData.perfil === "A") {
      return (
        <Col sm="4">
          <FormGroup>
            <Label for="select-payment">Perfil</Label>
            <Select
              placeholder="Selecione"
              className="react-select"
              classNamePrefix="select"
              options={profileOptions}
              isClearable={false}
              value={fields.perfil ? profileOptions.find((item) => item.value === fields.perfil) : ""}
              onChange={(item) => setFields({ ...fields, perfil: item.value })}
            />
          </FormGroup>
        </Col>
      )
    } else {
      return null
    }
  }
*/
  return (
    <div>
      <Modal className="modal-lg" isOpen={isOpen} toggle={handleToggle}>
        <Form className="w-100" onSubmit={handleSubmit}>
          <ModalHeader toggle={handleToggle}>{dataToEdit && dataToEdit.id ? "Editar Usuário" : "Novo Usuário"}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <CustomInput type="switch" id="isActive" name="isActive" label="Ativo" inline />
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label for="usuario">Nome de usuário</Label>
                  <Input type="text" name="usuario" id="usuario" placeholder="Nome de usuário" defaultValue={fields.usuario} onChange={(e) => setFields({ ...fields, usuario: e.target.value })} />
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label for="login" warning>
                    Login
                  </Label>
                  <Input type="text" name="login" id="login" placeholder="Login" value={fields.login} onChange={(e) => setFields({ ...fields, login: e.target.value })} />
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label for="email">E-mail</Label>
                  <Input type="text" name="email" id="email" placeholder="email@email.com" defaultValue={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} />
                </FormGroup>
              </Col>

              {/*<Profile />*/}

              <Col sm="4">
                <FormGroup>
                  <Label for="select-payment">Perfil</Label>
                  <Select
                    placeholder="Selecione"
                    className="react-select"
                    classNamePrefix="select"
                    options={profileOptions}
                    isClearable={false}
                    value={fields.perfil ? profileOptions.find((item) => item.value === fields.perfil) : ""}
                    onChange={(item) => setFields({ ...fields, perfil: item.value })}
                  />
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <Label for="senha">Senha</Label>
                  <Input type="password" id="senha" name="senha" onChange={(e) => setFields({ ...fields, senha: e.target.value })} />
                </FormGroup>
              </Col>
              <Col sm="4" className="mt-2">
                <FormGroup>
                  <PasswordStrengthBar password={fields.senha} shortScoreWord="muito curta" scoreWords={["fraca", "fraca", "ok", "boa", "forte"]} />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <FormGroup className="d-flex mb-0">
              <Button.Ripple className="mr-1" color="primary" type="submit">
                Salvar
              </Button.Ripple>
              <Button.Ripple outline color="secondary" type="reset" onClick={() => handleToggle()}>
                Cancelar
              </Button.Ripple>
            </FormGroup>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  )
}

export default ModalUsers
