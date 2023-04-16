import Loading from "@/components/loading";
import StaticHead from "@/components/statichead";

export default function Community({users}){
    if(!users){
        return <Loading />
    }
    function getUserKey(email){
        let hash = 0;
        if(!email.length){
            return 69;
        }
        for(let i = 0; i < email.length ;i++){
            const ch = email.charCodeAt(i)
            hash = ((hash << 5) - hash) + ch 
            hash = hash & hash
        }
        hash = Math.abs(hash)
        return hash
    }
    return (
        <>
            <StaticHead />
            <section className="community">
                <p className="community__title">Community</p>
                <br/>
                <span className="community_">
                {users.map((user) => (
                    <a href={`/users/${getUserKey(user.email)}`} key={user.id}>
                        <span className="user">
                            <img src={user.pfp} />
                            <span>
                                <p>{user.creator}</p>
                            </span>
                        </span>
                    </a>
                ))}
                </span>

            </section>
        </>
    )
}

export async function getServerSideProps(){
    const response = await fetch("https://friendverse.vercel.app/api/users");

    const data = await response.json();
    return {
        props: {
            users: data
        }
    }
}