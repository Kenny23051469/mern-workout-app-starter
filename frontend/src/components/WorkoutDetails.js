import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

function WorkoutDetails({ workout }) {
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();

    const [isEditing, setIsEditing] = useState(false);
    const [updatedWorkout, setUpdatedWorkout] = useState({
        title: workout.title,
        reps: workout.reps,
        load: workout.load
    });

    // Handle update form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedWorkout(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle update form submission
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!user) {
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedWorkout)
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'UPDATE_WORKOUT', payload: json });
            setIsEditing(false); // Close the edit form after successful update
        }
    };

    // Handle delete workout
    const handleDelete = async () => {
        if (!user) {
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE_WORKOUTS', payload: json });
        }
    };

    return (
        <div className="workout-details">
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={updatedWorkout.title}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Load (kg):
                        <input
                            type="number"
                            name="load"
                            value={updatedWorkout.load}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Reps:
                        <input
                            type="number"
                            name="reps"
                            value={updatedWorkout.reps}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button type="submit">Update Workout</button>
                    <button type="button" class="edit-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <>
                    <h4>{workout.title}</h4>
                    <p><strong>Load (kg):</strong> {workout.load}</p>
                    <p><strong>Reps:</strong> {workout.reps}</p>
                    <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
                    <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </>
            )}
        </div>
    );
}

export default WorkoutDetails;
