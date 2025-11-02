// Timeline interfaces
interface TimelineCategory {
    tag: string;
    color: string;
}

interface TimelineLink {
    url: string;
    text: string;
}

interface TimelineData {
    text: string;
    date: string;
    category: TimelineCategory;
    link?: TimelineLink;
}

// Timeline data structure
const timelineData: TimelineData[] = [
    {
        text: 'Initial consultation and diagnosis',
        date: 'March 15, 2024',
        category: {
            tag: 'consultation',
            color: '#10b981'
        },
        link: {
            url: '#',
            text: 'View Details'
        }
    },
    {
        text: 'Blood work and lab results completed',
        date: 'March 18, 2024',
        category: {
            tag: 'lab work',
            color: '#f59e0b'
        },
        link: {
            url: '#',
            text: 'View Results'
        }
    },
    {
        text: 'Started medication treatment plan',
        date: 'March 22, 2024',
        category: {
            tag: 'treatment',
            color: '#3b82f6'
        },
        link: {
            url: '#',
            text: 'View Plan'
        }
    },
    {
        text: 'Follow-up appointment - positive progress',
        date: 'April 05, 2024',
        category: {
            tag: 'follow-up',
            color: '#8b5cf6'
        }
    },
    {
        text: 'X-ray and imaging completed',
        date: 'April 12, 2024',
        category: {
            tag: 'imaging',
            color: '#ef4444'
        },
        link: {
            url: '#',
            text: 'View Images'
        }
    }
];

// TimelineItem Component
const TimelineItem = ({ data, index }: { data: TimelineData, index: number }) => (
    <div className={`
        flex relative my-6 w-full
        ${index % 2 === 0 ? 'justify-start' : 'justify-end'}
        md:justify-center
    `}>
        <div className={`
            shadow-lg rounded-lg bg-white flex flex-col p-5 relative w-96 max-w-[45%]
            ${index % 2 === 0 ? 'items-start text-left mr-auto' : 'items-end text-right ml-auto'}
            md:max-w-full md:items-center md:text-center md:mx-4
        `}>
            {/* Tag */}
            <span
                className={`
                    absolute top-2 text-white text-xs font-bold tracking-wider px-3 py-1 uppercase rounded
                    ${index % 2 === 0 ? 'left-2' : 'right-2'}
                    md:left-2 md:right-auto md:w-[calc(100%-16px)] md:text-center
                `}
                style={{ backgroundColor: data.category.color }}
            >
                {data.category.tag}
            </span>

            {/* Date */}
            <time className="text-gray-500 text-sm font-bold mt-9 md:mt-10">
                {data.date}
            </time>

            {/* Text */}
            <p className="text-base leading-6 my-4 max-w-[250px]">
                {data.text}
            </p>

            {/* Link */}
            {data.link && (
                <a
                    href={data.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 after:content-['_►'] after:text-xs md:underline md:after:hidden"
                >
                    {data.link.text}
                </a>
            )}

            {/* Arrow pointing to timeline - hidden on mobile */}
            <div className={`
                absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rotate-45 border shadow-md
                ${index % 2 === 0
                    ? '-right-2 shadow-[1px_-1px_1px_rgba(0,0,0,0.2)]'
                    : '-left-2 shadow-[-1px_1px_1px_rgba(0,0,0,0.2)]'
                }
                md:hidden
            `} />

            {/* Circle on timeline */}
            {/* <div className={`
                absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-4 border-red-400 rounded-full z-20
                ${index % 2 === 0 ? '-right-14' : '-left-14'}
                md:-right-14 md:left-auto
            `} /> */}
        </div>
    </div>
);

// Timeline Container Component
const Timeline = () => (
    <div className="flex flex-col relative my-10 before:absolute before:bg-red-400 before:left-1/2 before:w-1 before:h-full before:transform before:-translate-x-1/2 before:content-[''] before:z-0">
        {timelineData.map((data, idx) => (
            <TimelineItem data={data} key={idx} index={idx} />
        ))}
    </div>
);

const PatientTimeline = () => {
    // Patient data - can be dynamically passed or fetched based on patient selection
    const patientData = {
        name: "Ishaan Pandey",
        gender: "Male",
        age: 21
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex justify-between items-center">
                    <div>
                        <div className="text-2xl font-bold text-gray-800 mb-1">{patientData.name}</div>
                        <div className="text-gray-600">{patientData.gender}, {patientData.age} years old</div>
                        <div className="text-sm text-gray-500 mt-1">Patient Medical Timeline</div>
                    </div>
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt={patientData.name}
                        className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-md object-cover"
                    />
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Medical History Timeline</h2>
                    <Timeline />
                </div>
            </div>
        </div>
    );
};

export default PatientTimeline;