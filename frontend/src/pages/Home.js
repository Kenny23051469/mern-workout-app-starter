import { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

function Home() {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [sortBy, setSortBy] = useState("newest");

  // Fetch workouts data when the user is authenticated
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/workouts`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            dispatch({ type: "SET_WORKOUTS", payload: data });
          }
        } catch (error) {
          console.error("Error fetching workouts:", error);
        }
      };
      fetchData();
    }
  }, [dispatch, user]);

  // Function to sort workouts based on selected criteria
  const sortWorkouts = (workouts, criteria) => {
    const workoutCopy = [...workouts];
    switch (criteria) {
      case "newest":
        return workoutCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return workoutCopy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "heaviest":
        return workoutCopy.sort((a, b) => b.load - a.load);
      case "lightest":
        return workoutCopy.sort((a, b) => a.load - b.load);
      case "mostReps":
        return workoutCopy.sort((a, b) => b.reps - a.reps);
      case "leastReps":
        return workoutCopy.sort((a, b) => a.reps - b.reps);
      default:
        return workoutCopy;
    }
  };

  const sortedWorkouts = workouts ? sortWorkouts(workouts, sortBy) : [];

  return (
    <div className="home">
      <div className="left-column">
        <div className="sort-options">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="heaviest">Heaviest Load</option>
            <option value="lightest">Lightest Load</option>
            <option value="mostReps">Most Reps</option>
            <option value="leastReps">Least Reps</option>
          </select>
        </div>

        <div className="workouts">
          {sortedWorkouts.map((workout) => (
            <WorkoutDetails key={workout._id} workout={workout} />
          ))}
        </div>
      </div>

      <div className="right-column">
        <WorkoutForm />
      </div>
    </div>
  );
}

export default Home;
