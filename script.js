// EMI Calculator
function calculateLoan() {
    let name = document.getElementById("name").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let interest = parseFloat(document.getElementById("interest").value);
    let years = parseFloat(document.getElementById("years").value);
    let loanType = document.getElementById("loanType").value;
    let resultDiv = document.getElementById("result");

    if (name === "" || isNaN(amount) || isNaN(interest) || isNaN(years)) {
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "⚠️ Please fill all details properly with valid numbers.";
        resultDiv.style.border = "1px solid rgba(255, 100, 100, 0.3)";
        resultDiv.style.background = "rgba(255, 100, 100, 0.05)";
        return;
    }

    let monthlyInterest = interest / 100 / 12;
    let months = years * 12;

    let emi = (amount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / (Math.pow(1 + monthlyInterest, months) - 1);
    let totalPayment = emi * months;
    let totalInterest = totalPayment - amount;

    resultDiv.style.display = "block";
    resultDiv.style.border = "1px solid rgba(0, 212, 255, 0.2)";
    resultDiv.style.background = "rgba(0, 212, 255, 0.05)";
    resultDiv.innerHTML = `
        <strong>Applicant:</strong> ${name}<br>
        <strong>Loan Type:</strong> ${loanType}<br>
        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:10px 0;">
        <strong style="color:var(--primary); font-size:18px;">Monthly EMI: ₹${emi.toFixed(2)}</strong><br>
        <strong>Total Interest:</strong> ₹${totalInterest.toFixed(2)}<br>
        <strong>Total Payment:</strong> ₹${totalPayment.toFixed(2)}
    `;
}

// FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-icon').textContent = '+';
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
                button.querySelector('.faq-icon').textContent = '×';
            }
        });
    });
});
