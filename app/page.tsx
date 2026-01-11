'use client'
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from '@giphy/js-fetch-api';
import { useState, useEffect } from "react";
import { GifOverlayProps } from "@giphy/react-components";
// API Ключ Giphy
const gf = new GiphyFetch('dqSODCnnpKWmKcn8V5PsUfnIBXqebTu7');

export default function Home() {
  const [messages, setMessages] = useState<{ text: string; time: Date }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isGifMenuOpen, setGifMenuOpen] = useState(false);
  const [gifSearchText, setGifSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  // Задержка для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setGifSearchText(debouncedSearchText);
    }, 500); 
    return () => clearTimeout(timer); // Если что-то пишем, то таймер не идет
  }, [debouncedSearchText]);

  useEffect(() => {
    if (gifSearchText.trim()) {
      setGifMenuOpen(true);
    } else {
      setGifMenuOpen(false);
    }
  }, [gifSearchText]);

  const fetchGifs = (offset: number) => gf.search(gifSearchText, { offset, limit: 10 });

  const handleSendMessage = () => {
    if (inputText.trim() && !inputText.startsWith('/gif')) {
      const newMessage = { text: inputText.trim(), time: new Date() };
      setMessages((prev) => [...prev, newMessage]);
      setInputText('');
    }
  };

  const handleGifSelect = (gifUrl: string) => {
    const newMessage = { text: gifUrl, time: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    setGifMenuOpen(false);
    setInputText('');
  };

  const handleInputChange = (text: string) => {
    setInputText(text);

    if (text.startsWith('/gif ')) {
      const searchQuery = text.replace('/gif ', '').trim();
      setDebouncedSearchText(searchQuery); // Устанавливаем текст поиска с задержкой
    } else {
      setGifMenuOpen(false); // Закрываем меню, если нет /gif
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getCurrentTime = () => {
    const currentTime = new Date();
    return currentTime
  };

  return (
  <div className="chat-container">
    <div className="messages-container">
    {isGifMenuOpen && (
      <div className="gif-menu">
        <Grid
          hideAttribution={true}
          width={380}
          columns={3}
          fetchGifs={fetchGifs}
          onGifClick={(gif, e) => {
            e.preventDefault();
            handleGifSelect(gif.images.fixed_height.url);
          }}
        />
      </div>
    )}
      {messages.map((msg, index) => (
        <div key={index} className="message">
          {msg.text.startsWith('http') ? (
            <table>
              <tbody>
                <tr>
                  <td><img src={msg.text} alt="GIF" className="gif-image" /></td>
                  <td className="time-row" style={{position: 'relative'}}><p className="timestamp" style={{bottom: '0px', position:'absolute', marginBlockEnd:'5px'}}>{msg.time.getHours()}:{(msg.time.getMinutes() < 10 ? '0' : '') + msg.time.getMinutes()}</p></td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table>
              <tbody>
                <tr>
                  <td className="normal-message"><p className="message-bubble">{msg.text}</p></td>
                  <td className="time-row" style={{position: 'relative'}}><p className="timestamp" style={{bottom: '5px', position:'absolute'}}>{msg.time.getHours()}:{(msg.time.getMinutes() < 10 ? '0' : '') + msg.time.getMinutes()}</p></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>

    <div className="input-container">
      {/* <div className="colored-gif-div"><span className="colored-gif">/gif</span></div> */}
      <div className="colored-gif-div" style={{ visibility: inputText.startsWith('/gif') ? 'visible' : 'hidden' }}>
      <span className="colored-gif">/gif</span></div>
      <input
        type="text"
        value={inputText}
        placeholder="Напишите сообщение..."
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="text-input"
      />
    </div>
  </div>
  );
}