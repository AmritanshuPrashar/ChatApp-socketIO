import { useEffect } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useMemo } from "react";
const App = () => {
	const socket = useMemo(() => io("http://localhost:3000"), []);
	const [message, setMessage] = useState("");
	const [room, setRoom] = useState("");
	const [socketID, setSocketID] = useState("");
	const [messages, setMessages] = useState([]);
	const [roomName, setRoomName] = useState("");
	useEffect(() => {
		socket.on("connect", () => {
			setSocketID(socket.id);
			console.log("Connected to server : ", socket.id);
		});
		socket.on("welcome", (data) => {
			console.log(data);
		});
		socket.on("received-message", (data) => {
			setMessages((messages) => [
				...messages,
				{
					message: data.message,
					From: data.socketID,
				},
			]);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		socket.emit("message", { message, room, socketID });
		setMessages((messages) => [
			...messages,
			{
				message,
				To: room,
			},
		]);
		setMessage("");
		setRoom("");
	};

	const handleCustomRoom = (e) => {
		e.preventDefault();
		socket.emit("join-room", { room: roomName, socketID });
		setRoomName("");
	};
	return (
		<Container maxWidth="sm">
			<Typography variant="h2" component="div" gutterBottom>
				Chatty
			</Typography>
			<Typography
				variant="h6"
				component="div"
				gutterBottom
				style={{ color: "#3f51b5", fontWeight: "bold" }}
			>
				My Room ID : {socketID}
			</Typography>

			<form onSubmit={handleSubmit}>
				<TextField
					onChange={(e) => setMessage(e.target.value)}
					value={message}
					id="outlined-basic"
					label="Type a message"
					variant="outlined"
					fullWidth
				/>

				<TextField
					onChange={(e) => setRoom(e.target.value)}
					value={room}
					id="outlined-basic"
					label="Enter room id"
					variant="outlined"
					fullWidth
				/>

				<Button type="submit" variant="contained" color="primary" fullWidth>
					Send
				</Button>
			</form>

			{/*<form onSubmit={handleCustomRoom}>
			
			<TextField
			onChange={(e) => setRoomName(e.target.value)}
			value={roomName}
			id="outlined-basic"
			label="Enter custom room name :"
			variant="outlined"
			fullWidth
	/>
	<Button type="submit" variant="contained" color="primary" fullWidth>
			Send
		</Button>
			
	</form> */}
			<Stack>
				{messages.map((msg, index) => (
					<div
						key={index}
						style={{
							background: "#f5f5f5",
							padding: "10px",
							marginBottom: "10px",
						}}
					>
						<Typography variant="body1">{msg.message}</Typography>
						{msg.To && <Typography variant="caption">To : {msg.To}</Typography>}
						{msg.From && (
							<Typography variant="caption">From : {msg.From}</Typography>
						)}
					</div>
				))}
			</Stack>
		</Container>
	);
};

export default App;
