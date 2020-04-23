import React, { useEffect, useState } from 'react'
import { FirestoreContext } from './FirestoreContextProvider'

const Streak = () => {
  const db = React.useContext(FirestoreContext)
  const [rank, setRank] = useState<Rank>({})
  useEffect(() => {
    const getStreakRank = async () => {
      const rankFromDB = await db.collection('streakRank').orderBy('created', 'desc').get()
      setRank(rankFromDB.docs[0].data())
    }
    getStreakRank()
  }, [db, setRank])
  return (
    <div>
      {rank.streakRank !== undefined &&
        rank.streakRank.map((rankItem: IRankItem) => (
          <div key={rankItem.user.picture} className="single-streak flex items-center mb-3">
            <img src={rankItem.user.picture} alt="プロフィール写真" className="w-10 rounded-full" />
            <span className="text-lg font-medium ml-4">{rankItem.user.displayName}</span>
            <span className="ml-2 px-2 py-1 text-xs bg-orange-300 rounded-full">
              {rankItem.streak > 0 ? (
                <span role="img" aria-label="fire">
                  🔥
                </span>
              ) : (
                <span role="img" aria-label="fire">
                  👊
                </span>
              )}
              {rankItem.streak}
            </span>
          </div>
        ))}
    </div>
  )
}

export default Streak

interface Rank {
  streakRank?: IRankItem[]
  created?: number
}

interface IRankItem {
  streak: number
  user: {
    displayName: string
    picture: string
    userName: string
  }
}
