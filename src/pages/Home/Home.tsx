import Board from "../../components/Board";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const HomePage = () => {
    return (
        <main>
            <div className="fixed top-0 w-screen bg-black">
                <Header />
            </div>

            <div className="mx-auto my-24">
                <section className="flex flex-col px-4 lg:items-center lg:px-0 overflow-scroll overflow-y-hidden">
                    <Board />
                </section>
            </div>

            <div className="flex flex-col items-center justify-center">
                <div className="fixed bottom-0 w-screen bg-black">
                    <Footer />
                </div>
            </div>
        </main>
    );
}

export default HomePage;