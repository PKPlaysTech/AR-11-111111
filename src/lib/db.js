import { 
  ref, 
  set, 
  get, 
  child, 
  push,
  serverTimestamp,
  orderByChild,
  remove,
  update,
  onValue
} from "firebase/database";
import { db } from "./firebase";

// Helper to generate random 5-letter game code
export const generateGameCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a new game
export const createGame = async (gameData) => {
  const gameCode = generateGameCode();
  const gameRef = ref(db, 'games/' + gameCode);
  
  await set(gameRef, {
    ...gameData,
    code: gameCode,
    createdAt: serverTimestamp(),
  });
  
  return gameCode;
};

// Update an existing game
export const updateGame = async (gameCode, gameData) => {
  const gameRef = ref(db, `games/${gameCode}`);
  
  await update(gameRef, {
    ...gameData,
    updatedAt: serverTimestamp(),
  });
};

// Delete a game
export const deleteGame = async (gameCode) => {
  const gameRef = ref(db, `games/${gameCode}`);
  await remove(gameRef);
};

// Get all games for dashboard
export const getAllGames = async () => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, 'games'));
  if (snapshot.exists()) {
    const gamesObj = snapshot.val();
    return Object.keys(gamesObj).map(key => ({
      id: key,
      ...gamesObj[key]
    })).reverse(); // Newest first
  }
  return [];
};

// Get a game by code
export const getGame = async (gameCode) => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `games/${gameCode.toUpperCase()}`));
  
  if (snapshot.exists()) {
    return { id: snapshot.key, ...snapshot.val() };
  }
  return null;
};

// Save student score
export const saveScore = async (gameCode, teamName, newTotalScore) => {
  // Use teamName as key so it overwrites instead of creating a new entry
  const teamKey = teamName.replace(/\\W+/g, '-').toLowerCase();
  const teamScoreRef = ref(db, `games/${gameCode.toUpperCase()}/scores/${teamKey}`);
  
  await set(teamScoreRef, {
    teamName,
    score: newTotalScore,
    timestamp: serverTimestamp()
  });
};

// Get Leaderboard for a game
export const getLeaderboard = async (gameCode) => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `games/${gameCode.toUpperCase()}/scores`));
  
  if (snapshot.exists()) {
    const scoresObj = snapshot.val();
    const leaderboard = Object.keys(scoresObj).map(key => ({
      id: key,
      ...scoresObj[key]
    }));
    
    // Sort descending by score
    leaderboard.sort((a, b) => b.score - a.score);
    return leaderboard;
  }
  
  return [];
};

// Subscribe to real-time Leaderboard updates
export const subscribeToLeaderboard = (gameCode, callback) => {
  const scoresRef = ref(db, `games/${gameCode.toUpperCase()}/scores`);
  const unsubscribe = onValue(scoresRef, (snapshot) => {
    if (snapshot.exists()) {
      const scoresObj = snapshot.val();
      const leaderboard = Object.keys(scoresObj).map(key => ({
        id: key,
        ...scoresObj[key]
      }));
      leaderboard.sort((a, b) => b.score - a.score);
      callback(leaderboard);
    } else {
      callback([]);
    }
  });
  return unsubscribe;
};

// Save a quiz record (student attempt)
export const saveQuizRecord = async (gameCode, username, questionText, isCorrect, selectedAnswer) => {
  const recordsRef = ref(db, 'quiz_records');
  await push(recordsRef, {
    gameCode,
    username,
    questionId: questionText,
    isCorrect,
    selectedAnswer: selectedAnswer || "",
    timestamp: serverTimestamp()
  });
};

// Subscribe to or get all quiz records
export const getAllQuizRecords = async () => {
  const recordsRef = ref(db, 'quiz_records');
  const snapshot = await get(recordsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })).sort((a, b) => b.timestamp - a.timestamp);
  }
  return [];
};
