import React, { useState } from "react";

function StatusTabs({ onTabChange }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const statuses = [
        "Pending appointments",
        "Confirmed appointments",
        "Rescheduled appointments",
        "Completed appointments",
        "Cancelled appointments",
        "No-show appointments",
    ];

    const handleClick = (index) => {
        setActiveIndex(index);
        if (onTabChange) {
            onTabChange(statuses[index]);
        }
    };

    return (
        <div className="d-flex overflow-auto">
            {statuses.map((status, index) => (
                <button
                    key={index}
                    className={`btn btn-sm ${activeIndex === index ? "btn-primary" : "btn btn-light btn-outline-primary"
                        } ${index === statuses.length - 1 ? "me-0" : "me-3"}`}
                    onClick={() => handleClick(index)}
                >
                    {status}
                </button>
            ))}
        </div>
    );
}

export default StatusTabs;


