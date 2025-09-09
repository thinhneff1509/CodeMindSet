// Fibonacci
function fibDP(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new Error("n must be a non-negative integer");
    }
    let a = 0n; // F(0)
    let b = 1n; // F(1)
    for (let i = 0; i < n; i++) {
        const next = a + b; // BigInt + BigInt
        a = b;
        b = next;
    }
    return a; // sau n bước, a = F(n)
}

// Bản memoization để so sánh: O(n) time, O(n) space =====
function fibMemo(n, memo = {}) {
    if (n <= 1) return BigInt(n);
    if (memo[n] !== undefined) return memo[n];
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}

// Kiểm thử tính đúng đắn
(function testCorrectness() {
    console.log("== Correctness check ==");
    const t10 = fibDP(10);
    const t20 = fibDP(20);
    const t50 = fibDP(50);
    console.log("F(10) =", t10.toString());
    console.log("F(20) =", t20.toString());
    console.log("F(50) =", t50.toString());

    console.assert(t10 === 55n, "F(10) must be 55");
    console.assert(t20 === 6765n, "F(20) must be 6765");
    console.assert(t50 === 12586269025n, "F(50) must be 12586269025");
    console.log("All assertions passed ✅");
})();

// Benchmark: đo 10 lần, in từng lần bằng console.time/timeEnd và in trung bình
function bench(fn, n, repeat = 10) {
    let sumMs = 0;
    for (let i = 1; i <= repeat; i++) {
        const label = `run ${i}`; // Sửa lỗi cú pháp ở đây
        console.time(label);      // Bắt đầu đo cho lần chạy này
        const t0 = (typeof performance !== "undefined" ? performance.now() : Date.now());
        fn(n);
        const t1 = (typeof performance !== "undefined" ? performance.now() : Date.now());
        console.timeEnd(label);   // Kết thúc đo và in ra thời gian lần chạy này
        sumMs += (t1 - t0);       // Cộng vào tổng thời gian để tính trung bình
    }
    const avg = sumMs / repeat;
    console.log(`Average over ${repeat} runs: ${avg.toFixed(6)} ms`);
    return avg;
}


// Chạy benchmark cho F(50)
console.log("== Benchmark F(50) ==");
bench(fibDP, 50, 10);

// so sánh với bản memoization
console.log("== Benchmark F(50) with memoization ==");
bench(fibMemo, 50, 10);