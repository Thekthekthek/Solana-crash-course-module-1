import { GenerateKeypair } from "./keypair/load_keypair";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Transfer } from "./data/send_data/transfer";
import { Ping } from "./data/send_data/ping";
import { FetchMovies, Movie, ReviewMovie } from "./data/send_data/movie_review";
import { Course, FetchCourse, ReviewCourse } from "./data/send_data/student_review";
import { FetchAccount } from "./events/listenToEvents";
import { fetchMetadata } from "./data/fetch_data/SMBmetadata";

const transferExample = async (connection: Connection, keypair: Keypair) => {
  const recipient = new PublicKey("596zNK9GSZBRw2zWyW9kuJ1sQb3k2VQ4HEW4dYgWNBKU");

  const signature = await Transfer(connection, keypair, recipient, 0.1);

  console.log(`✅ Transaction sent: ${signature}`);
  const balanceInSol = (await connection.getBalance(keypair.publicKey)) / LAMPORTS_PER_SOL;
  const balanceInSolRecipient = (await connection.getBalance(recipient)) / LAMPORTS_PER_SOL;
  console.log(`The balance of the account at ${keypair.publicKey} is ${balanceInSol} SOLs`);
  console.log(`The balance of the account at ${recipient} is ${balanceInSolRecipient} SOLs`);
};

const pingExample = async (connection: Connection, keypair: Keypair) => {
  const signature = Ping(connection, keypair);
  console.log(`✅ Transaction sent: ${signature}`);
};

const reviewMovieExample = async (connection: Connection, keypair: Keypair) => {
  ReviewMovie(new Movie("The Matrixos", 10, "A great movie"), connection, keypair);
};

const fetchMovies = async () => {
  const movies = await FetchMovies();
  movies.forEach((movie) => {
    if (movie === null) return;
    console.log(movie.title);
    console.log(movie.description);
  });
};

const reviewCourseExample = async (connection: Connection, keypair: Keypair) => {
  ReviewCourse(new Course("Solana", "That course was kinda great ngl"), connection, keypair);
};

const fetchCourse = async () => {
  const courses = await FetchCourse();
  courses.forEach((course) => {
    if (course === null) return;
    console.log(course.name);
    console.log(course.message);
  });
};

(async () => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const keypair = await GenerateKeypair(connection);
  await transferExample(connection, keypair);
  await pingExample(connection, keypair);
  await reviewMovieExample(connection, keypair);
  await reviewCourseExample(connection, keypair);
  await fetchMovies();
  await fetchCourse();
  FetchAccount();
  fetchMetadata(connection);
})();
