const Card = ({ title, amount, color }: { title: string; amount: string; color: string }) => {
    return (
        <div className={`p-4 rounded-lg ${color} text-white`}>
            <h3 className="text-lg">{title}</h3>
            <p className="text-2xl font-bold">{amount}</p>
        </div>
    );
};

export default Card;
