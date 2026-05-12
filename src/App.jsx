import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);

  function handleShowAddFriend() {
    setShowAddFriend((oldVal) => !oldVal);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  return (
    <div>
      <FriendsList friends={friends} />
      {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
      <Button onClick={handleShowAddFriend}>
        {showAddFriend ? "Close" : "Add friend"}
      </Button>
      <FormSplitBill />
    </div>
  );
}

function FriendsList({ friends }) {
  return (
    <ul className="friends-list">
      {friends.map((friend) => (
        <Friend key={friend.id} friend={friend} />
      ))}
    </ul>
  );
}

function Friend({ friend }) {
  return (
    <li>
      <img src={friend.image} alt={`${friend.name} photo`} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p style={{ color: "red" }}>
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p style={{ color: "green" }}>
          Sarah owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button>Select</Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label htmlFor="name">First name</label>
      <input
        type="text"
        placeholder="Jane Doe"
        id=",name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="image">Image URL</label>
      <input
        type="text"
        placeholder=""
        id="image"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <label htmlFor="bill-value">Bill value</label>
      <input type="text" id="bill-value" />
      <label htmlFor="your-expense">Your expense</label>
      <input type="text" id="your-expense" />
      <label htmlFor="friend-expense">X expense</label>
      <input type="text" id="friend-expense" disabled />
      <label htmlFor="who-pays">Who is paying the bill?</label>
      <select id="who-pays">
        <option value="user">You</option>
        <option value="friend">X</option>
      </select>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default App;
