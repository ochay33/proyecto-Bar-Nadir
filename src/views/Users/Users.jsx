import { useState, useEffect } from "react"
import axios from "axios"
import Container from "react-bootstrap/Container"


export const Users = () => {
	const [users, setUsers] = useState([])
	const [userEditable, setuserEditable] = useState({})
	const [showForm, setShowForm] = useState(false)
	const [createOrEdit, setCreateOrEdit] = useState("")

	useEffect(() => {
		fetch(`${import.meta.env.VITE_SERVER_URI}/api/read-users`)
			.then(response => response.json())
			.then(loquerecibo => setUsers(loquerecibo))
	}, [])
    
	const headers = {
		Authorization: "Bearer " + localStorage.getItem("token"),
	  };

	const deleteUser = async id => {
		const resp = await axios.delete(
			`${import.meta.env.VITE_SERVER_URI}/api/delete-user/${id}`,
			{
				headers,
			}
		)
		const { status } = resp

		if (status === 200) {
			const deleteUser = users.filter(user => user.id !== id)
			setUsers(deleteUser)
		}
	}

	const updateUser = async user => {
		const { id, email , username , password , address  } = user

		const resp = await axios.put(
			`${import.meta.env.VITE_SERVER_URI}/api/update-user`,
			{
				id_user: id,
				modify: {
					email , 
                    username , 
                    password , 
                    address,
				},
			},
			{
				headers,
			}
		)
		const { status } = resp

		if (status === 200) {
			const othersusers = users.filter(prev => prev.id !== user.id)
			setUsers([...othersusers, user])
		}
		setShowForm(false)
	}

	const createUser = async user => {
		const { email , username , password , address } = user

		const resp = await axios.post(
			`${import.meta.env.VITE_SERVER_URI}/api/create-user`,
			{
				email ,
                username ,
                password ,
                address,
			},
			{
				headers: { ...headers, accept: "application/json"},
			}
		)
		const { status } = resp

		if (status === 201) {
			const othersusers = users.filter(prev => prev.id !== user.id)
			setUsers([...othersusers, user])
		}
		setShowForm(false)
	}

	const handleDelete = (id, username) => {
		let validator = window.confirm(
			`Está seguro que quiere eliminar el user ${username}?`
		)
		if (validator) deleteUser(id)
	}

	const handleEdit = user => {
		setShowForm(true)
		setuserEditable(user)
		setCreateOrEdit("edit")
	}

	const handleCreate = () => {
		setShowForm(true)
		setuserEditable({})
		setCreateOrEdit("create")
	}

	return (
		<Container className="mt-4" id="admin">
			<h1 style={{ color: "white"}}>Admin</h1>
			{!showForm && (
				<table className="table">
					<thead className="thead-dark">
						<tr style={{ color: "white"}}>
							<th scope="col">Email</th>
							<th scope="col">username</th>
							<th scope="col">password</th>
							<th scope="col">Address</th>
						</tr>
					</thead>
					<tbody>
						{users.map(user => (
							<tr key={user.id}>
								<th className="letra_tabla">{user.email}</th>
								<td className="letra_tabla">{user.username}</td>
								<td className="letra_tabla">{user.password}</td>
								<td className="letra_tabla">{user.address}</td>
								<td>
									<button
										className="btn btn-danger mr-2 mb-2"
										onClick={() =>
											handleDelete(user.id, user.username)
										}
									>
										Eliminar
									</button>
									<button
										className="btn btn-warning mr-2 mb-2 "
										onClick={() => handleEdit(user)}
									>
										Editar
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
			<button onClick={handleCreate}>Crear nuevo</button>
			{showForm && (
				<form>
					<div style={{ color: "white"}}>
						<label>Email</label>
						<input
							type="text"
							value={userEditable.email}
							onChange={event =>
								setuserEditable(prev => {
									return { ...prev, email: event.target.value }
								})
							}
						/>
					</div>
					<div style={{ color: "white"}}>
						<label>Username</label>
						<textarea
							value={userEditable.username}
							onChange={event =>
								setuserEditable(prev => {
									return { ...prev, username: event.target.value }
								})
							}
						></textarea>
					</div>
					<div style={{ color: "white"}}>
						<label>Password</label>
						<textarea
							value={userEditable.password}
							onChange={event =>
								setuserEditable(prev => {
									return { ...prev, password: event.target.value }
								})
							}
						></textarea>
					</div>
					<div style={{ color: "white"}}>
						<label>Address</label>
						<textarea
							value={userEditable.address}
							onChange={event =>
								setuserEditable(prev => {
									return { ...prev, address: event.target.value }
								})
							}
						></textarea>
					</div>
					{createOrEdit === "edit" && (
						<button
							type="button"
							onClick={() => updateUser(userEditable)}
						>
							Editar
						</button>
					)}
					{createOrEdit === "create" && (
						<button
							type="button"
							onClick={() => createUser(userEditable)}
						>
							Crear
						</button>
					)}
				</form>
			)}
		</Container>
	)
}