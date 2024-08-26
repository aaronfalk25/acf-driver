export default function Signin() {
    return (
        <div>
            <h1>Signin</h1>
            <form>
                <label>
                    Email:
                    <input type="text" name="email" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
    }