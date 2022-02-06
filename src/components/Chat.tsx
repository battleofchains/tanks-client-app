import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { styled } from '@mui/material';

const ChatContainer = styled('div')({
	padding: '17px 10px',
	border: '2px solid #461415',
	borderColor: '#461415',
	overflowY: 'auto',
	backgroundColor: '#d8e0ed',
	borderRadius: 15,
	fontSize: 16,
});

const ChatMessagesContainer = styled('div')({
	padding: 10,
	backgroundColor: '#aeb2be',
	overflowY: 'auto',
	borderRadius: 10,
	marginBottom: 5,
});

const ChatBtn = styled('div')({
	width: 86,
	height: 86,
	background:
		'url(https://static.ubex.com/tanks.app/assets/gui/chat_button.png) no-repeat center',
	textDecoration: 'none',
	display: 'block',
});

const ChatCloseButton = styled('div')({
	background:
		'url(https://static.ubex.com/tanks.app/assets/gui/chat_close.png) no-repeat center',
	cursor: 'pointer',
	width: 20,
	height: 20,
});

const ChatHeader = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	marginBottom: 10,
});

const ChatFooter = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
});

const ChatSendButton = styled('button')({
	width: 41,
	height: 40,
	border: 'none',
	background:
		'url(https://static.ubex.com/tanks.app/assets/gui/chat_message.png) transparent no-repeat center',
});

const ChatInput = styled('input')({
	border: 'none',
	background: 'transparent',
	outline: 'none',
	fontSize: 16,
});

export default ({ height }: any) => {
	const { messages } = useSelector((state: RootState) => state.chat);
	const [text, setText] = React.useState('');
	const [isMaximse, setIsMaximise] = React.useState(false);
	const dispatch = useDispatch();
	const handleChangeText = (e: any) => {
		setText(e.target.value);
	};
	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch({
			type: 'socket',
			payload: { text },
			meta: { event: 'room_message' },
		});
		setText('');
	};
	const messagesEndRef = React.useRef();
	const scrollToBottom = () => {
		if (messagesEndRef && messagesEndRef.current) {
			// @ts-ignore
			const msgs = messagesEndRef.current.children;
			const lastMsg = msgs[msgs.length - 1];
			if (!lastMsg) {
				return;
			}
			lastMsg.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
				inline: 'nearest',
			});
		}
	};
	const toggleChat = () => {
		setIsMaximise(!isMaximse);
		setTimeout(() => {
			if (isMaximse) {
				scrollToBottom();
			}
		});
	};
	React.useEffect(() => {
		scrollToBottom();
	}, [messages]);
	if (!isMaximse) {
		return <ChatBtn onClick={() => toggleChat()} />;
	}
	return (
		<ChatContainer>
			<form onSubmit={handleSend}>
				<ChatHeader>
					<strong>Chat</strong>
					<ChatCloseButton onClick={() => toggleChat()} />
				</ChatHeader>
				<ChatMessagesContainer
					ref={messagesEndRef}
					style={{ height: height || 300 }}
				>
					{messages.map((m, i) => (
						<div key={`${m}_${i}`}>
							<strong>{m.from}:</strong> {m.text}
						</div>
					))}
				</ChatMessagesContainer>
				<ChatFooter>
					<ChatInput
						autoFocus
						value={text}
						onChange={(e) => handleChangeText(e)}
						style={{ color: 'inherit' }}
					/>
					<ChatSendButton type="submit" />
				</ChatFooter>
			</form>
		</ChatContainer>
	);
};
