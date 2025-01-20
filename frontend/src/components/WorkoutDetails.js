import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Switch from "react-switch";  // Import react-switch

export default function WorkoutDetails({ workout }) {
  const { dispatch } = useWorkoutsContext();
  const [checked, setChecked] = useState(workout.completed || false); // State to track switch

  // Handle the deletion of the workout
  const handleClick = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`,
      {
        method: "DELETE",
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };

  // Handle the toggle change to mark as completed
  const handleToggleCompleted = async (nextChecked) => {
    setChecked(nextChecked);

    const updatedWorkout = {
      ...workout,
      completed: nextChecked,
    };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWorkout),
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_WORKOUT", payload: json });
    }
  };

  return (
    <div className={`workout-details ${checked ? "completed" : ""}`}>
      <h4>{workout.title}</h4>
      <p>
        <strong>Load (kg): </strong>
        {workout.load}
      </p>
      <p>
        <strong>Reps: </strong>
        {workout.reps}
      </p>
      <p>
        <strong>Created: </strong>
        {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
      </p>

      <div className="action-container">
        <span onClick={handleClick} className="delete-btn">
          <FontAwesomeIcon icon={faTrash} title="Delete workout" />
        </span>

        <label>
          <Switch
            onChange={handleToggleCompleted}
            checked={checked}
            className="react-switch"
          />
        </label>
      </div>
    </div>
  );
}
