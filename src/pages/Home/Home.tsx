import Board from "../../components/Board";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const HomePage = () => {
    return (
        <main className='flex flex-col min-h-screen bg-black justify-between min-w-max'>
            <div className="fixed top-0 left-0 w-full z-50 bg-black">
                <Header />
            </div>

            <div className="max-w-7xl mx-auto p-16 mt-4">
                <section className="flex flex-col items-center justify-center">
                    <Board />
                </section>
            </div>
            <div className="fixed bottom-0 left-0 w-full z-50 bg-black">
                <div className="mx-auto bg-black">
                    <Footer />
                </div>
            </div>
        </main>
    );
}

export default HomePage;